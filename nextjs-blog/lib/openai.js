// lib/openai.js
const axios = require('axios');

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/engines/davinci/completions';

const callOpenAI = async (prompt) => {
  const data = {
    prompt: prompt,
    // ...other parameters
  };

  try {
    const response = await axios.post(OPENAI_ENDPOINT, data, {
      headers: {
        'Authorization': `Bearer YOUR_API_KEY`
        // ...other headers
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = callOpenAI;
