import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled", "free"],
    default: "free",
  },
  date: {
    type: Date,
    default: null,
  },
})

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    beachId: {
      type: String,
      required: [true, "Beach ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    photo: {
      type: String,
      default: "https://via.placeholder.com/800x600",
    },
    payment: {
      type: paymentSchema,
      default: () => ({}),
    },
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: 1,
    },
    participants: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    organizer: {
      type: String,
      default: "Beach Management",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual property for available seats
eventSchema.virtual("availableSeats").get(function () {
  return this.seats - this.participants
})

// Virtual property for event status
eventSchema.virtual("status").get(function () {
  const now = new Date()
  const eventDate = new Date(this.date)

  if (eventDate < now) {
    return "past"
  } else if (this.participants >= this.seats) {
    return "full"
  } else {
    return "available"
  }
})

// Index for efficient queries
eventSchema.index({ date: 1 })
eventSchema.index({ beachId: 1 })
eventSchema.index({ "payment.status": 1 })

const Event = mongoose.model("Event", eventSchema)

export default Event
