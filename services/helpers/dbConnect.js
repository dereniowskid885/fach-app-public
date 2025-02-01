const dbConnect = async (mongoose, mongoURL) => {
  try {
    await mongoose.connect(mongoURL);

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = dbConnect;
