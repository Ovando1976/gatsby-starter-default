const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const driverId = req.query.driverId;
    const requesterId = req.query.requesterId;
    const requesterRole = req.query.role;

    if (!driverId) return res.status(400).json({ error: "driverId is required." });
    if (driverId !== requesterId && requesterRole !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }

    const snapshot = await db.collection("users").doc(driverId).get();
    if (!snapshot.exists) return res.status(404).json({ error: "Driver profile not found." });

    res.status(200).json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    console.error("Error fetching driver profile:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;