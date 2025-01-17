const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("vehicles").get();
    const vehicles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection("vehicles").doc(id).get();

    if (!snapshot.exists) return res.status(404).json({ error: "Vehicle not found." });

    res.status(200).json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    console.error("Error fetching vehicle:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;