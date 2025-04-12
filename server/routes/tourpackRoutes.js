import express from "express"
import { calculateTourPackage, getRecreationalActivities } from "../controllers/tourpackController.js"

const router = express.Router()

// Route to calculate tour package
router.post("/calculate", calculateTourPackage)

// Route to get recreational activities
router.get("/activities", getRecreationalActivities)

export default router
