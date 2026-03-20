const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');

class LLMClient {
  constructor(provider, apiKey) {
    this.provider = provider;
    if (provider === 'openai') {
      this.client = new OpenAI({ apiKey });
    } else if (provider === 'gemini') {
      this.client = new GoogleGenAI({ apiKey });
    } else {
      throw new Error('Unsupported provider');
    }
  }

  async generate(prompt) {
    if (this.provider === 'openai') {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      });
      return response.choices[0].message.content;
    } else if (this.provider === 'gemini') {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    }
  }
}

module.exports = LLMClient;
