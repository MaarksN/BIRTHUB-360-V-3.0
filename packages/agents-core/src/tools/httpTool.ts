export const httpTool = {
  name: 'http_request',
  description: 'Faz uma requisição HTTP para a URL fornecida',
  execute: async (url: string, method: string = 'GET', body?: any) => {
    try {
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: body ? { 'Content-Type': 'application/json' } : undefined
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }
};
