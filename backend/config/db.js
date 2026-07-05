import mongoose from 'mongoose';

class Database {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async connect() {
    if (this.isConnected) {
      console.log('✅ Using existing database connection');
      return true;
    }

    try {
      console.log(`🔄 Connecting to MongoDB (attempt ${this.retryCount + 1}/${this.maxRetries})...`);
      
      // Remove deprecated options
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      this.isConnected = true;
      this.retryCount = 0;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);

      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      return true;

    } catch (error) {
      console.error(`❌ Connection attempt ${this.retryCount + 1} failed:`, error.message);
      this.isConnected = false;
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = 2000 * this.retryCount;
        console.log(`⏳ Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.connect();
      } else {
        console.error('❌ Max retries reached. Could not connect to MongoDB.');
        console.log('💡 Tips:');
        console.log('   1. For local MongoDB: mongodb://localhost:27017/trackwise');
        console.log('   2. For Atlas: mongodb+srv://username:password@cluster.mongodb.net/trackwise');
        console.log('   3. Make sure MongoDB is running');
        console.log('   4. Check your connection string in .env');
        return false;
      }
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ MongoDB disconnected');
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

const db = new Database();
export default db;