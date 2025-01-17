const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

router.get("/", async (req, res) => {
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

module.exports = router;