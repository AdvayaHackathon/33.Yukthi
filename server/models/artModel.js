import mongoose from "mongoose";

// Define Artifact Schema
const artifactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Artifact name is required"],
    trim: true
  },
  beachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beach',
    required: [true, "Beach ID is required"]
  },
  shopName: {
    type: String,
    required: [true, "Shop name is required"],
    trim: true
  },
  shopAddress: {
    type: String,
    required: [true, "Shop address is required"],
    trim: true
  },
  shopAddressLink: {
    type: String,
    trim: true
  },
  openingTime: {
    type: String,
    trim: true
  },
  closingTime: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"]
  },
  photo: {
    type: String,
    default: "default-artifact.jpg"
  },
  description: {
    type: String,
    default: "A beautiful artifact from the beach."
  },
  details: {
    type: String,
    default: "Handcrafted with care and precision."
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Artifact model
const Artifact = mongoose.model("Artifact", artifactSchema);

export default Artifact;