
import express from "express"
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventsByDateRange,
  getFeaturedEvents,
} from "../controllers/eventController.js"

const router = express.Router()

// Featured events route
router.get("/featured", getFeaturedEvents)

// Date range route
router.get("/date-range", getEventsByDateRange)

// Register for event
router.patch("/:id/register", registerForEvent)

// Standard CRUD routes
router.route("/").get(getAllEvents).post(createEvent)

router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent)

export default router
