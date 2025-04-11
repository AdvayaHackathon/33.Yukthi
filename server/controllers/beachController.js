import { execSync } from "child_process";
import path from "path";

export const generateBeachReport = async (req, res) => {
  const { lat, lon } = req.body;

  console.log(`Received location: (${lat}, ${lon})`);

  try {
    // Run algo.js as a separate process with latitude and longitude as command line arguments
    const reportData = runJsScript(lat, lon);
    console.log("Report generation completed successfully");
    console.log(reportData);
    // Send the report
    res.json({
      beachReport: reportData,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      error: "Failed to generate beach report",
      details: error.message,
    });
  }
};

const runJsScript = (lat, lon) => {
  try {
    // Get the absolute path to algo.js
    const scriptPath = path.resolve("utils/algo.js");

    // Execute the script with latitude and longitude as command line arguments
    const output = execSync(`node ${scriptPath} ${lat} ${lon}`, {
      encoding: "utf-8",
    });

    // Parse the output - assuming algo.js outputs JSON
    try {
      // Try to parse as JSON first
      return JSON.parse(output);
    } catch (parseError) {
      // If not valid JSON, return the raw output
      return output.trim();
    }
  } catch (error) {
    console.error(`Error executing algo.js: ${error.message}`);
    throw new Error("Failed to generate beach report");
  }
};