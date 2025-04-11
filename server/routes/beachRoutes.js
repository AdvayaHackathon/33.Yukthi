import express from "express";
import multer from "multer";
import * as beachController from "../controllers/beachController.js";
import * as ratingController from "../controllers/ratingController.js";
//import * as warningController from "../controllers/warningController.js";
import * as wasteController from "../controllers/wasteController.js";
import * as beachFetch from "../controllers/beachfetch.js";

const router = express.Router();

// Set up multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const isFileTypeValid = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const isMimeTypeValid = allowedFileTypes.test(file.mimetype);
    if (isFileTypeValid && isMimeTypeValid) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG images are allowed."));
    }
  },
});

router.post("/location", beachController.generateBeachReport);
router.post("/submit-report", wasteController.submitReport);
router.get(
  "/beach-cleanliness/:beachName",
  wasteController.getBeachCleanliness
);
router.get("/beach-waste-types/:beachName", wasteController.getBeachWasteTypes);
//router.post("/warnings", warningController.getWarnings);
// router.get("/ratings", ratingController.getAllRatings);
// router.post("/ratings", upload.single("beachImage"), ratingController.createRating);
//router.get("/:id", ratingController.getRatingById);
router.post("/rating", ratingController.submitRating);
router.get("/rating", ratingController.getAllRatings);
router.get("/beaches", beachFetch.getAllBeaches);

export default router;