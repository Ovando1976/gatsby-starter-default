require("dotenv").config();
const openai = require("openai");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Stripe Initialization
const gpt4o = require("./pages/api/gpt4o");
const payment = require("./pages/api/payment");
const documents = require("./pages/api/documents");
const userProfile = require("./pages/api/userProfile");
const userPosts = require("./pages/api/userPosts");
const driverProfile = require("./pages/api/driverProfile");
const restaurants = require("./pages/api/restaurants");
const vehicles = require("./pages/api/vehicles");

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server running on ws://localhost:8080");
});

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // Broadcast to everyone
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Firebase Admin Initialization
if (!admin.apps.length) {
  admin.initializeApp();
} else {
  console.log("Firebase Admin already initialized.");
}

const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

// Initialize Express App
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve Static React Build
app.use(express.static(path.join(__dirname, "./build")));

// Fallback for React App
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

app.use("/api/gpt4o", gpt4o);
app.use("/api/create-payment-intent", payment);
app.use("/api/documents", documents);
app.use("/api/userProfile", userProfile);
app.use("/api/userPosts", userPosts);
app.use("/api/driverProfile", driverProfile);
app.use("/api/restaurants", restaurants);
app.use("/api/vehicles", vehicles);



app.get("/api/userPosts", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    const query = userId === "ALL"
      ? db.collection("posts")
      : db.collection("posts").where("userId", "==", userId);

    const snapshot = await query.get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------------------------------------------------------------
   GPT-4 Completion Endpoint
--------------------------------------------------------------------- */
app.post("/gpt4o", async (req, res) => {
  try {
    const { prompt, maxTokens } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required." });

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens || 150,
    });

    const responseText = completion.data.choices[0]?.message?.content || "No response generated.";
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("[GPT-4o Error]", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------------------------------------------------------------
   Payment Intent Endpoint (Stripe)
--------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------
   /api/uploadImage - Handles Image Uploads
--------------------------------------------------------------------- */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post("/api/uploadImage", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileName = `${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(`blogImages/${fileName}`);

    // Upload the file to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/blogImages/${fileName}`;
    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ error: "Failed to upload image. Please try again." });
  }
});

/* ---------------------------------------------------------------------
   /api/createPost - Handles Blog Post Creation
--------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------
   Firestore-Based Endpoints
--------------------------------------------------------------------- */

app.get("/api/documents", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId is required." });

    const snapshot = await db.collection("documents").where("ownerId", "==", userId).get();
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: error.message });
  }
});

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

app.get("/api/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection("restaurants").doc(id).get();

    if (!snapshot.exists) return res.status(404).json({ error: "Restaurant not found." });

    const menu = snapshot.data().menu || [];
    res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: error.message });
  }
});

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

app.get("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection("vehicles").doc(id).get();

    if (!snapshot.exists) return res.status(404).json({ error: "Vehicle not found." });

    res.status(200).json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------------------------------------------------------------
   Error Handling Middleware
--------------------------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

/* ---------------------------------------------------------------------
   Local Dev Server
--------------------------------------------------------------------- */
if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Local server running on port ${port}`);
  });
}

/* ---------------------------------------------------------------------
   Export for Firebase Cloud Functions Deployment
--------------------------------------------------------------------- */
exports.api = functions.https.onRequest(app);