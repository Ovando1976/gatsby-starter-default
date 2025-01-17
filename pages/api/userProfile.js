const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const requesterId = req.query.requesterId;
    const requesterRole = req.query.role;

    if (!userId) return res.status(400).json({ error: "userId is required." });
    if (userId !== requesterId && requesterRole !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }

    const snapshot = await db.collection("users").doc(userId).get();
    if (!snapshot.exists) return res.status(404).json({ error: "User profile not found." });

    res.status(200).json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;