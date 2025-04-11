import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  beachName: { type: String, required: true },
  cleanliness: { type: String, required: true },
  selectedWastes: { type: [String], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
