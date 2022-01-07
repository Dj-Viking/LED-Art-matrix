import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/led-matrix');

export default mongoose.connection;