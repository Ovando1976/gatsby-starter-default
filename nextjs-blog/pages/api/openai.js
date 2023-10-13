// pages/api/openai.js
const callOpenAI = require('../../lib/openai');

const Openai = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!req.body.message) {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  try {
    const message = await callOpenAI(req.body.message);
    res.status(200).json({ message: message.trim() });
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    res.status(500).json({ message: "Sorry, I couldn't fetch a response. Please try again later." });
  }
};

module.exports = Openai;
