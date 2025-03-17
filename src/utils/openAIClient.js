'use strict';
const { OpenAI } = require('openai');

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
  // Optionally configure basePath or other options
});

module.exports = openaiClient;
