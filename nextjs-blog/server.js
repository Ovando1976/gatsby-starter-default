require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 8080;  // Use the provided PORT or default to 8080

// Single instance of cors middleware with the common configuration
app.use(cors());

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, './build')));

// Handle POST requests for completions
app.post('/completions', async (req, res) => {
  const prompt = req.body.prompt;
  const maxTokens = req.body.maxTokens;

  try {
    const openAIResponse = await openai.complete({
      model: "text-davinci-002",  // Corrected model name
      prompt: prompt,
      max_tokens: maxTokens,
    });
    res.status(200).send(openAIResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('OpenAI API request failed.');
  }
});

const chatRoutes = require('./pages/api/openai');
app.use('/openai', chatRoutes);  // Specified a base path for chatRoutes

// Handle all other routes by serving the React application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

console.log('API Key from .env:', process.env.OPENAI_API_KEY);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
