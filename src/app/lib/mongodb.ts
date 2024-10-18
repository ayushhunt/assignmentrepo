import mongoose from 'mongoose';

const connectMongo = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export default connectMongo;
