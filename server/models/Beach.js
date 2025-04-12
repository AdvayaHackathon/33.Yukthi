import mongoose from 'mongoose';

const beachSchema = new mongoose.Schema({
    name: String,
    location: {
      latitude: Number,
      longitude: Number,
    },
    overallSuitability: String,
  });
  
export default  mongoose.model("Beach", beachSchema);
