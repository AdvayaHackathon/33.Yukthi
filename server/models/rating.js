// rating.js
import mongoose from 'mongoose';

// Define the schema for the rating
const ratingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  beachname: { type: String, required: true },
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  cleanlinessRating: { type: Number, required: true, min: 1, max: 5 },
  facilityAndServiceRating: { type: Number, required: true, min: 1, max: 5 },
  activitiesAndAttractionRating: { type: Number, required: true, min: 1, max: 5 },
  ratingPara: { type: String, required: true },
});

// Create the model from the schema
const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;