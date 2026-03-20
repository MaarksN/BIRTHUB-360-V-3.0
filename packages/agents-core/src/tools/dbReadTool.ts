export const dbReadTool = {
  name: 'db_read',
  description: 'Lê dados de um banco de dados relacional',
  execute: async (query: string, params?: any[]) => {
    // Simula uma leitura no banco de dados
    console.log(`Executing query: ${query} with params: ${params}`);
    return { status: 'success', data: [{ id: 1, name: 'Sample' }] };
  }
};
