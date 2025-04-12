import express from "express";
import {
  getAllArtifacts,
  getArtifactById,
  getArtifactsByBeachId,
  createArtifact,
  updateArtifact,
  deleteArtifact
} from "../controllers/artController.js";

const router = express.Router();

// Get all artifacts
router.get("/artifacts", getAllArtifacts);

// Get artifact by ID
router.get("/artifacts/:id", getArtifactById);

// Get artifacts by beach ID
router.get("/beaches/:beachId/artifacts", getArtifactsByBeachId);

// Create a new artifact
router.post("/artifacts", createArtifact);

// Update an artifact
router.patch("/artifacts/:id", updateArtifact);

// Delete an artifact
router.delete("/artifacts/:id", deleteArtifact);

export default router;