require("dotenv").config(); // Load .env
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// ------------------------
// STRIPE SETUP
// ------------------------
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "Not Loaded");
// ------------------------
// OPENAI SETUP
// ------------------------
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// ------------------------
// WEBSOCKET SERVER
// ------------------------
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server running on ws://localhost:8080");
});

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // Broadcast incoming message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// ------------------------
// FIREBASE ADMIN INIT
// ------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    // If you need specific credentials, pass them here
    // e.g. credential: admin.credential.cert(serviceAccount),
    // or other config from environment variables
  });
} else {
  console.log("Firebase Admin already initialized.");
}

const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

// ------------------------
// EXPRESS APP
// ------------------------
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// SERVE REACT BUILD (if any)
// ------------------------
app.use(express.static(path.join(__dirname, "./build")));

// Fallback: serve index.html from React build
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

// ------------------------
// GPT-4 COMPLETION ENDPOINT
// ------------------------
app.post("/gpt4o", async (req, res) => {
  try {
    const { prompt, maxTokens = 150 } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required." });

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
    });

    const responseText = completion.data.choices?.[0]?.message?.content || "No response generated.";
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("[GPT-4o Error]", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------
// STRIPE PAYMENT INTENT
// ------------------------
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required." });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("[Stripe Error]", error.message);
    res.status(500).json({ error: "Error creating PaymentIntent." });
  }
});

// ------------------------
// FILE UPLOAD (MULTER + FIREBASE STORAGE)
// ------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

app.post("/api/uploadImage", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileName = `${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(`blogImages/${fileName}`);

    // Upload file to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true,
    });

    // Public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/blogImages/${fileName}`;
    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ error: "Failed to upload image. Please try again." });
  }
});

// ------------------------
// CREATE A BLOG POST
// ------------------------
app.post("/api/createPost", async (req, res) => {
  try {
    const { title, excerpt, content, category, imageUrl, authorId } = req.body;

    if (!title || !excerpt || !content || !category || !authorId) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (title.length > 100) {
      return res.status(400).json({ error: "Title must not exceed 100 characters." });
    }
    if (excerpt.length > 300) {
      return res.status(400).json({ error: "Excerpt must not exceed 300 characters." });
    }

    const postRef = await db.collection("articles").add({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      category,
      imageUrl: imageUrl || null,
      date: admin.firestore.Timestamp.fromDate(new Date()),
      viewCount: 0,
      authorId,
    });

    res.status(201).json({ message: "Post created successfully.", id: postRef.id });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Failed to create post. Please try again." });
  }
});

// ------------------------
// FIRESTORE QUERIES
// ------------------------
app.get("/api/documents", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required." });

    const snapshot = await db.collection("documents").where("ownerId", "==", userId).get();
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET all restaurants
app.get("/api/restaurants", async (req, res) => {
  try {
    const snapshot = await db.collection("restaurants").get();
    const restaurants = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET restaurant menu by id
app.get("/api/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const docSnap = await db.collection("restaurants").doc(id).get();

    if (!docSnap.exists) return res.status(404).json({ error: "Restaurant not found." });

    const menu = docSnap.data().menu || [];
    res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET all vehicles
app.get("/api/vehicles", async (req, res) => {
  try {
    const snapshot = await db.collection("vehicles").get();
    const vehicles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET single vehicle by id
app.get("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docSnap = await db.collection("vehicles").doc(id).get();

    if (!docSnap.exists) return res.status(404).json({ error: "Vehicle not found." });
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET userPosts?userId=123 or userId=ALL
app.get("/api/userPosts", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    let query = db.collection("posts");
    if (userId !== "ALL") {
      query = query.where("userId", "==", userId);
    }

    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------
// ERROR HANDLING
// ------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// ------------------------
// LOCAL DEV SERVER
// ------------------------
if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port}`);
  });
}

// ------------------------
// EXPORT FOR FIREBASE FUNCTIONS
// ------------------------
exports.api = functions.https.onRequest(app);