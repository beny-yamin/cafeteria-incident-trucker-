const mongoose = require('mongoose');// means taking the mongoose library for connecting the database from
// all talks about 
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/university-food-quality';
    const connectionInstance = await mongoose.connect(mongoUri);
    console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection FAILED: ', error);
    process.exit(1);
  }
};

module.exports = connectDB;
