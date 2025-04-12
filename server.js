const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// MongoDB Connection
const MONGO_URI =
  "mongodb+srv://aayushperu04:D1Zl2jP5qArjl3lO@cluster0.lnzxqeg.mongodb.net/beachesDB?retryWrites=true&w=majority&appName=Cluster0"

console.log("Connecting to MongoDB...")
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./public/uploads"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Define Beach Schema - keep it simple
const beachSchema = new mongoose.Schema({
  name: String,
  location: Object,
  icon: String,
  overallSuitability: String,
  activities: {
    land: [String],
    water: [String],
    air: [String]
  },
  waterQuality: Object,
})

// Create Beach model with explicit collection name
const Beach = mongoose.model("Beach", beachSchema, "beaches")

// Define Stay Schema
const staySchema = new mongoose.Schema({
  name: String,
  address: String,
  priceRange: {
    min: Number,
    max: Number,
  },
  beachId: mongoose.Schema.Types.ObjectId,
  roomTypes: [String],
  photo: String,
  addressLink: String,
  openingTime: String,
  closingTime: String,
  payment: {
    amount: Number,
    status: String,
    date: Date,
  },
})

const Stay = mongoose.model("Stay", staySchema, "stays")

// Define Restaurant Schema
const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  beachId: mongoose.Schema.Types.ObjectId,
  dishes: [String],
  photo: String,
  addressLink: String,
  openingTime: String,
  closingTime: String,
  payment: {
    amount: Number,
    status: String,
    date: Date,
  },
})

const Restaurant = mongoose.model("Restaurant", restaurantSchema, "restaurants")

// Define Artcraft Schema
const artifactSchema = new mongoose.Schema({
  name: String,
  beachId: mongoose.Schema.Types.ObjectId,
  shopName: String,
  shopAddress: String,
  shopAddressLink: String,
  openingTime: String,
  closingTime: String,
  price: Number,
  photo: String,
})

const Artifact = mongoose.model("Artifact", artifactSchema, "artifacts")

// Define Guide Schema
const guideSchema = new mongoose.Schema({
  name: String,
  experience: Number,
  state: String,
  price: Number,
  contact: String,
})

const Guide = mongoose.model("Guide", guideSchema, "guides")

// Define Event Schema
const eventSchema = new mongoose.Schema({
  name: String,
  beachId: mongoose.Schema.Types.ObjectId,
  date: Date,
  time: String,
  description: String,
  photo: String
})

const Event = mongoose.model("Event", eventSchema, "events")

// Define Ad Schema
const adSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  url: String,
  image: String,
  payment: {
    amount: Number,
    status: String,
    date: Date,
  },
})

const Ad = mongoose.model("Ad", adSchema, "ads")

// Define Activity Schema
const activitySchema = new mongoose.Schema({
  name: String,
  beachId: mongoose.Schema.Types.ObjectId,
  activityType: {
    type: String,
    enum: ['land', 'water', 'air'],
    required: true
  },
  description: String,
  price: Number,
  duration: Number,
  provider: String,
  contact: String
})

const Activity = mongoose.model("Activity", activitySchema, "activities")

// Define Payment Schema
const paymentSchema = new mongoose.Schema({
  entityId: mongoose.Schema.Types.ObjectId,
  entityType: String,
  amount: Number,
  status: String,
  upiId: String,
  timestamp: Date,
})

const Payment = mongoose.model("Payment", paymentSchema, "payments")

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// API Routes
// Get all beaches - simplified to just return names and IDs
app.get("/api/beaches", async (req, res) => {
  console.log("API route /api/beaches called")
  try {
    const beaches = await Beach.find({}, "name _id")
    console.log("Beaches found:", beaches)
    res.json(beaches)
  } catch (error) {
    console.error("Error fetching beaches:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new stay
app.post("/api/stays", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      address,
      priceRangeMin,
      priceRangeMax,
      beachId,
      roomTypes,
      addressLink,
      openingTime,
      closingTime,
      paymentAmount,
    } = req.body

    // Create new stay
    const newStay = new Stay({
      name,
      address,
      priceRange: {
        min: priceRangeMin,
        max: priceRangeMax,
      },
      beachId,
      roomTypes: roomTypes ? roomTypes.split(",").map((type) => type.trim()) : [],
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      addressLink,
      openingTime,
      closingTime,
      payment: {
        amount: paymentAmount || 0,
        status: "pending",
        date: new Date(),
      },
    })

    await newStay.save()

    res.status(201).json({
      message: "Stay added successfully",
      stayId: newStay._id,
      requiresPayment: paymentAmount && paymentAmount > 0,
    })
  } catch (error) {
    console.error("Error adding stay:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new restaurant
app.post("/api/restaurants", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      address,
      beachId,
      dishes,
      addressLink,
      openingTime,
      closingTime,
      paymentAmount,
    } = req.body

    // Create new restaurant
    const newRestaurant = new Restaurant({
      name,
      address,
      beachId,
      dishes: dishes ? dishes.split(",").map((dish) => dish.trim()) : [],
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      addressLink,
      openingTime,
      closingTime,
      payment: {
        amount: paymentAmount || 0,
        status: "pending",
        date: new Date(),
      },
    })

    await newRestaurant.save()

    res.status(201).json({
      message: "Restaurant added successfully",
      restaurantId: newRestaurant._id,
      requiresPayment: paymentAmount && paymentAmount > 0,
    })
  } catch (error) {
    console.error("Error adding restaurant:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new artcraft
app.post("/api/artifacts", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      beachId,
      shopName,
      shopAddress,
      shopAddressLink,
      openingTime,
      closingTime,
      price,
      paymentAmount,
    } = req.body

    // Create new artcraft
    const newArtifact = new Artifact({
      name,
      beachId,
      shopName,
      shopAddress,
      shopAddressLink,
      openingTime,
      closingTime,
      price: price || 0,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      payment: {
        amount: paymentAmount || 0,
        status: "pending",
        date: new Date(),
      },
    })

    await newArtifact.save()

    res.status(201).json({
      message: "Artcraft product added successfully",
      artcraftId: newArtcraft._id,
      requiresPayment: paymentAmount && paymentAmount > 0,
    })
  } catch (error) {
    console.error("Error adding artcraft:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new guide
app.post("/api/guides", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      experience,
      state,
      price,
      contact,
      paymentAmount,
    } = req.body

    // Create new guide
    const newGuide = new Guide({
      name,
      experience: experience || 0,
      state,
      price: price || 0,
      contact,
      payment: {
        amount: paymentAmount || 0,
        status: "pending",
        date: new Date(),
      },
    })

    await newGuide.save()

    res.status(201).json({
      message: "Guide added successfully",
      guideId: newGuide._id,
      requiresPayment: paymentAmount && paymentAmount > 0,
    })
  } catch (error) {
    console.error("Error adding guide:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new event
app.post("/api/events", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      beachId,
      date,
      time,
      description,
    } = req.body

    // Create new event
    const newEvent = new Event({
      name,
      beachId,
      date: date ? new Date(date) : null,
      time,
      description,
      photo: req.file ? `/uploads/${req.file.filename}` : null
    })

    await newEvent.save()

    res.status(201).json({
      message: "Event added successfully",
      eventId: newEvent._id,
      requiresPayment: paymentAmount && paymentAmount > 0,
    })
  } catch (error) {
    console.error("Error adding event:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new ad
app.post("/api/ads", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      url,
      paymentAmount,
    } = req.body

    // Create new ad
    const newAd = new Ad({
      title,
      type,
      description,
      url,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      payment: {
        amount: paymentAmount || 0,
        status: "pending",
        date: new Date(),
      },
    })

    await newAd.save()

    res.status(201).json({
      message: "Advertisement added successfully",
      adId: newAd._id,
      requiresPayment: paymentAmount && paymentAmount > 0,
    })
  } catch (error) {
    console.error("Error adding advertisement:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new activity and update beach
app.post("/api/activities", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      beachId,
      activityType,
      description,
      price,
      duration,
      provider,
      contact
    } = req.body

    // Validate activity type
    if (!['land', 'water', 'air'].includes(activityType)) {
      return res.status(400).json({ 
        message: "Invalid activity type. Must be 'land', 'water', or 'air'." 
      })
    }

    // Create new activity
    const newActivity = new Activity({
      name,
      beachId,
      activityType,
      description,
      price: price || 0,
      duration: duration || 0,
      provider,
      contact,
    })

    await newActivity.save()

    // Update the beach's activities array
    // First, check if the beach exists
    const beach = await Beach.findById(beachId)
    if (!beach) {
      return res.status(404).json({ message: "Beach not found" })
    }

    // Initialize the activities object if it doesn't exist
    if (!beach.activities) {
      beach.activities = { land: [], water: [], air: [] }
    }

    // Add the activity name to the appropriate array if it doesn't already exist
    if (!beach.activities[activityType].includes(name)) {
      // Use $addToSet to avoid duplicates
      await Beach.findByIdAndUpdate(beachId, {
        $addToSet: { [`activities.${activityType}`]: name }
      })
      console.log(`Added ${name} to ${beach.name}'s ${activityType} activities`)
    }

    res.status(201).json({
      message: "Activity added successfully",
      activityId: newActivity._id,
      requiresPayment: paymentAmount && paymentAmount > 0,
    })
  } catch (error) {
    console.error("Error adding activity:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Payment API route
app.post("/api/payments", express.json(), async (req, res) => {
  try {
    const { amount, status, entityId, entityType, upiId, timestamp } = req.body
    
    // Create new payment
    const newPayment = new Payment({
      entityId,
      entityType,
      amount,
      status: status || "completed",
      upiId,
      timestamp: timestamp || new Date()
    })
    
    await newPayment.save()
    
    // Update the entity's payment status based on entityType
    if (entityId && entityType) {
      let model;
      
      switch(entityType.toLowerCase()) {
        case 'stay':
          model = Stay;
          break;
        case 'restaurant':
          model = Restaurant;
          break;
        case 'artcraft':
          model = Artcraft;
          break;
        case 'guide':
          model = Guide;
          break;
        case 'event':
          model = Event;
          break;
        case 'ad':
          model = Ad;
          break;
        case 'activity':
          model = Activity;
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      await model.findByIdAndUpdate(entityId, {
        'payment.status': status || "completed"
      });
    }
    
    res.status(201).json({
      message: "Payment recorded successfully",
      paymentId: newPayment._id
    })
  } catch (error) {
    console.error("Error recording payment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Open http://localhost:${PORT} in your browser`)
})