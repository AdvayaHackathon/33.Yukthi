import { fetchWarnings } from "../utils/warningsv1.js";

export const getWarnings = async (req, res) => {
  try {
    console.log("Received request for warnings");
    const warnings = await fetchWarnings();
    console.log("Fetched warnings:", warnings);
    res.json(warnings);
  } catch (error) {
    console.error("Error fetching warnings:", error);
    res.status(500).json({ error: "Failed to fetch warnings" });
  }
};
