class Agent {
  constructor(name, llmClient, systemInstruction = '', tools = [], memory = null) {
    this.name = name;
    this.llmClient = llmClient;
    this.systemInstruction = systemInstruction;
    this.tools = tools;
    this.memory = memory;
  }

  async execute(prompt) {
    const fullPrompt = `${this.systemInstruction}\n\nUser: ${prompt}`;
    return await this.llmClient.generate(fullPrompt);
  }
}

module.exports = Agent;
