require('dotenv').config();

function getOpenaiClient() {
  // Use dynamic import to load the openai package
  return import('openai').then((module) => {
    const { OpenAI } = module;
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  });
}

module.exports = getOpenaiClient;
