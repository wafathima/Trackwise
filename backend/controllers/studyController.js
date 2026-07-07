// backend/controllers/studyController.js
const StudyProgress = require('../models/StudyProgress');

// Get study progress
const getStudyProgress = async (req, res) => {
  try {
    let studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      // Create default study progress
      studyData = new StudyProgress({
        userId: req.user.id,
        streak: 0,
        totalHours: 0,
        sessionsCompleted: 0,
        weeklyGoalsCompleted: 0,
        points: 0,
        badges: [],
        consistency: 0,
        dailyData: [],
        activities: [],
        subjects: []
      });
      await studyData.save();
    }
    
    res.json(studyData);
  } catch (error) {
    console.error('Error fetching study progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log study session
const logStudySession = async (req, res) => {
  try {
    const { hours, subject, notes } = req.body;
    
    if (!hours || hours <= 0) {
      return res.status(400).json({ message: 'Valid hours are required' });
    }

    let studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      studyData = new StudyProgress({ userId: req.user.id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update streak
    const lastStudyDate = studyData.lastStudyDate ? new Date(studyData.lastStudyDate) : null;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastStudyDate || lastStudyDate < yesterday) {
      studyData.streak = 0;
    } else if (lastStudyDate >= today) {
      // Already studied today, don't increment streak
    } else {
      studyData.streak += 1;
    }

    // Update metrics
    studyData.totalHours += hours;
    studyData.sessionsCompleted += 1;
    studyData.lastStudyDate = new Date();

    // Add daily data
    const dailyEntry = studyData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    if (dailyEntry) {
      dailyEntry.hours += hours;
      if (subject) {
        const subjectEntry = dailyEntry.subjects.find(s => s.name === subject);
        if (subjectEntry) {
          subjectEntry.hours += hours;
        } else {
          dailyEntry.subjects.push({ name: subject, hours });
        }
      }
    } else {
      studyData.dailyData.push({
        date: today,
        hours,
        subjects: subject ? [{ name: subject, hours }] : [],
        notes: notes || ''
      });
    }

    // Calculate points
    const pointsEarned = hours * 10;
    studyData.points += pointsEarned;

    // Update consistency
    const last30Days = studyData.dailyData.slice(-30);
    const studyDays = last30Days.filter(d => d.hours > 0).length;
    studyData.consistency = Math.round((studyDays / 30) * 100);

    // Add activity
    studyData.activities.push({
      type: 'study',
      description: `Studied ${subject || 'various subjects'} for ${hours} hours`,
      date: new Date(),
      duration: hours,
      score: Math.round(hours * 10)
    });

    // Check for badges
    await checkStudyBadges(studyData);

    await studyData.save();

    res.json({
      message: 'Study session logged successfully',
      studyData,
      pointsEarned
    });
  } catch (error) {
    console.error('Error logging study session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update subject progress
const updateSubjectProgress = async (req, res) => {
  try {
    const { subject, progress, chapter } = req.body;
    
    let studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      return res.status(404).json({ message: 'Study data not found' });
    }

    let subjectData = studyData.subjects.find(s => s.name === subject);
    
    if (!subjectData) {
      subjectData = {
        name: subject,
        progress: 0,
        chapters: [],
        quizzes: []
      };
      studyData.subjects.push(subjectData);
    }

    if (chapter) {
      const chapterData = subjectData.chapters.find(c => c.name === chapter);
      if (!chapterData) {
        subjectData.chapters.push({
          name: chapter,
          completed: true,
          completedAt: new Date()
        });
      } else {
        chapterData.completed = true;
        chapterData.completedAt = new Date();
      }
    }

    // Update progress (calculate based on completed chapters)
    const totalChapters = subjectData.chapters.length;
    const completedChapters = subjectData.chapters.filter(c => c.completed).length;
    subjectData.progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : progress || 0;

    await studyData.save();

    res.json({
      message: 'Subject progress updated successfully',
      studyData
    });
  } catch (error) {
    console.error('Error updating subject progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get study stats
const getStudyStats = async (req, res) => {
  try {
    const studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      return res.json({
        streak: 0,
        totalHours: 0,
        sessionsCompleted: 0,
        points: 0,
        consistency: 0,
        badges: [],
        weeklyData: [0, 0, 0, 0, 0, 0, 0]
      });
    }

    // Get weekly data
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyData = studyData.dailyData
      .filter(d => new Date(d.date) >= weekStart)
      .map(d => d.hours);
    
    while (weeklyData.length < 7) {
      weeklyData.push(0);
    }

    res.json({
      streak: studyData.streak || 0,
      totalHours: studyData.totalHours || 0,
      sessionsCompleted: studyData.sessionsCompleted || 0,
      points: studyData.points || 0,
      consistency: studyData.consistency || 0,
      badges: studyData.badges || [],
      weeklyData: weeklyData.slice(0, 7)
    });
  } catch (error) {
    console.error('Error fetching study stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to check and award badges
const checkStudyBadges = async (studyData) => {
  const badges = studyData.badges || [];
  const existingBadgeNames = badges.map(b => b.name);

  const badgeChecks = [
    { name: 'First Study Session', condition: studyData.sessionsCompleted >= 1, icon: '📚' },
    { name: 'Study Streak 7 Days', condition: studyData.streak >= 7, icon: '🔥' },
    { name: 'Study Streak 30 Days', condition: studyData.streak >= 30, icon: '⭐' },
    { name: 'Study Master', condition: studyData.sessionsCompleted >= 100, icon: '🏆' },
    { name: 'Study Expert', condition: studyData.totalHours >= 100, icon: '🎓' },
    { name: 'Consistent Learner', condition: studyData.consistency >= 90, icon: '💪' }
  ];

  for (const check of badgeChecks) {
    if (check.condition && !existingBadgeNames.includes(check.name)) {
      badges.push({
        name: check.name,
        earnedAt: new Date(),
        icon: check.icon
      });
    }
  }

  studyData.badges = badges;
};

// Get all quizzes
const getQuizzes = async (req, res) => {
  try {
    const studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      return res.json([]);
    }

    // Get quizzes from all subjects
    const allQuizzes = [];
    studyData.subjects.forEach(subject => {
      if (subject.quizzes) {
        subject.quizzes.forEach(quiz => {
          allQuizzes.push({
            id: quiz._id,
            title: quiz.name,
            subject: subject.name,
            questions: quiz.questions?.length || 10,
            score: quiz.score || 0,
            completed: quiz.completed || false,
            attemptedAt: quiz.attemptedAt
          });
        });
      }
    });

    res.json(allQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      return res.status(404).json({ message: 'Study data not found' });
    }

    // Find quiz in subjects
    let foundQuiz = null;
    let foundSubject = null;
    
    for (const subject of studyData.subjects) {
      const quiz = subject.quizzes?.id(quizId);
      if (quiz) {
        foundQuiz = quiz;
        foundSubject = subject;
        break;
      }
    }

    if (!foundQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      quiz: foundQuiz,
      subject: foundSubject.name
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Start a quiz
const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      return res.status(404).json({ message: 'Study data not found' });
    }

    // Find and update quiz
    let found = false;
    for (const subject of studyData.subjects) {
      const quiz = subject.quizzes?.id(quizId);
      if (quiz) {
        quiz.startedAt = new Date();
        quiz.completed = false;
        quiz.score = 0;
        found = true;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await studyData.save();
    res.json({ message: 'Quiz started successfully' });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit quiz answer
const submitAnswer = async (req, res) => {
  try {
    const { quizId, questionId, answer } = req.body;
    const studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      return res.status(404).json({ message: 'Study data not found' });
    }

    // Find quiz and update answer
    let found = false;
    for (const subject of studyData.subjects) {
      const quiz = subject.quizzes?.id(quizId);
      if (quiz) {
        const question = quiz.questions?.id(questionId);
        if (question) {
          question.userAnswer = answer;
          question.isCorrect = question.correctAnswer === answer;
          if (question.isCorrect) {
            quiz.score = (quiz.score || 0) + 1;
          }
          found = true;
        }
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ message: 'Quiz or question not found' });
    }

    await studyData.save();
    res.json({ message: 'Answer submitted successfully' });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get quiz results
const getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studyData = await StudyProgress.findOne({ userId: req.user.id });
    
    if (!studyData) {
      return res.status(404).json({ message: 'Study data not found' });
    }

    let foundQuiz = null;
    for (const subject of studyData.subjects) {
      const quiz = subject.quizzes?.id(quizId);
      if (quiz) {
        foundQuiz = quiz;
        break;
      }
    }

    if (!foundQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const totalQuestions = foundQuiz.questions?.length || 0;
    const correctAnswers = foundQuiz.questions?.filter(q => q.isCorrect).length || 0;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Award points based on score
    if (score >= 80) {
      studyData.points += 50;
    } else if (score >= 60) {
      studyData.points += 30;
    } else if (score >= 40) {
      studyData.points += 10;
    }

    // Check for quiz badges
    await checkQuizBadges(studyData, score);

    foundQuiz.completed = true;
    foundQuiz.score = score;
    foundQuiz.completedAt = new Date();

    await studyData.save();

    res.json({
      score,
      totalQuestions,
      correctAnswers,
      percentage: score,
      completed: true
    });
  } catch (error) {
    console.error('Error getting quiz results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function for quiz badges
const checkQuizBadges = async (studyData, score) => {
  const badges = studyData.badges || [];
  const existingBadgeNames = badges.map(b => b.name);

  const badgeChecks = [
    { name: 'Quiz Master', condition: score >= 90, icon: '📝' },
    { name: 'Quiz Pro', condition: score >= 80, icon: '📚' },
    { name: 'Quiz Starter', condition: score >= 60, icon: '📖' }
  ];

  for (const check of badgeChecks) {
    if (check.condition && !existingBadgeNames.includes(check.name)) {
      badges.push({
        name: check.name,
        earnedAt: new Date(),
        icon: check.icon
      });
    }
  }

  studyData.badges = badges;
};

module.exports = {
  getStudyProgress,
  logStudySession,
  updateSubjectProgress,
  getStudyStats,
  getQuizzes,
  getQuizById,
  startQuiz,
  submitAnswer,
  getQuizResults
};