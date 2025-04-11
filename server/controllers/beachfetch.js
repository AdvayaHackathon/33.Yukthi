// API to fetch all beaches
import Beach from "../models/beach.js";

export const getAllBeaches = async (req, res) => {
  try {
    const beaches = await Beach.find();
    res.status(200).json(beaches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch beach data" });
  }
};
