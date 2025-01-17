const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("restaurants").get();
    const restaurants = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection("restaurants").doc(id).get();

    if (!snapshot.exists) return res.status(404).json({ error: "Restaurant not found." });

    const menu = snapshot.data().menu || [];
    res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;