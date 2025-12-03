import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Please check your MONGODB_URI in the .env file');
    console.error('💡 Make sure to replace <db_password> with your actual database password');
    process.exit(1);
  }
};

export default connectDB;
