const express = require("express");
const router = express.Router();
const openai = require("openai");

router.post("/", async (req, res) => {
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

module.exports = router;