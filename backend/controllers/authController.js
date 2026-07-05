// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Google authentication
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ 
        success: false, 
        message: "No credential provided" 
      });
    }

    console.log("🔐 Verifying Google token...");

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("✅ Google verification successful for:", payload.email);

    const { email, name, sub: googleId, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ 
        success: false, 
        message: "Email not verified by Google" 
      });
    }

    // Find or create user - Optimized fallback via sparse index
    let user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (!user) {
      console.log("👤 Creating new user from Google...");
      
      user = new User({
        name: name || email.split('@')[0],
        email: email,
        role: 'Student',
        googleId: googleId,
        avatar: picture || null,
        classGroup: null
      });

      await user.save();
      console.log("✅ User created successfully");
      
    } else {
      console.log("🔄 Updating existing user...");
      
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      
      await user.save();
      console.log("✅ User updated successfully");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data
    return res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      classGroup: user.classGroup,
      avatar: user.avatar,
      token: token,
    });

  } catch (error) {
    console.error("❌ Google auth error:", error);
    
    // Handle specific structural Google verification drops
    if (error.message.includes('audience')) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Google client ID configuration" 
      });
    }
    
    if (error.message.includes('expired')) {
      return res.status(400).json({ 
        success: false, 
        message: "Google token has expired" 
      });
    }
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, classGroup } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Student',
      classGroup: role === 'Student' ? classGroup : null
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        classGroup: user.classGroup,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      classGroup: user.classGroup,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide an email address" 
      });
    }

    // Find user
    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "No account found with that email address" 
      });
    }

    // Check if user is a Google OAuth user
    if (user.googleId) {
      return res.status(400).json({ 
        success: false, 
        message: "This account uses Google login. Please sign in with Google." 
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and save to database
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    console.log("\n=======================================================");
    console.log("🔑 PASSWORD RESET LINK:");
    console.log(resetUrl);
    console.log("📧 User Email:", user.email);
    console.log("=======================================================\n");

    // Try to send email
    let emailSent = false;
    try {
      // Configure transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"TrackWise Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🔐 Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #14b8a6;">Reset Your Password</h2>
            <p>Hello ${user.name || 'User'},</p>
            <p>You requested to reset your password. Click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #14b8a6; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy this link:</p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${resetUrl}
            </p>
            <p style="color: #999; font-size: 12px;">This link expires in 10 minutes.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log("✅ Email sent successfully to:", user.email);
      
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
      // Don't fail the request, just log the error
    }

    // Return response
    return res.status(200).json({ 
      success: true, 
      message: emailSent 
        ? "Password reset link sent to your email." 
        : "Reset link generated. (Email sending failed - check console for link)",
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later."
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Hash the token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token. Please request a new one." 
      });
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("✅ Password reset successful for:", user.email);

    res.json({ 
      success: true, 
      message: "Password updated successfully! You can now login." 
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again." 
    });
  }
};