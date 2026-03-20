import { createWorker } from 'queue';
import { WorkflowDAG } from 'workflows-core';

// Example Processor
const processJob = async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    console.log(`Data:`, job.data);

    // Simulated processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Job ${job.id} completed!`);
    return { status: 'success' };
};

// Creating workers that consume queues from the queue package
const agentWorker = createWorker('agent-execute', processJob);
const emailWorker = createWorker('send-email', processJob);
const webhookWorker = createWorker('send-webhook', processJob);

agentWorker.on('completed', job => console.log(`[Agent] Job ${job.id} has completed!`));
agentWorker.on('failed', (job, err) => console.error(`[Agent] Job ${job?.id} has failed with ${err.message}`));

emailWorker.on('completed', job => console.log(`[Email] Job ${job.id} has completed!`));
emailWorker.on('failed', (job, err) => console.error(`[Email] Job ${job?.id} has failed with ${err.message}`));

webhookWorker.on('completed', job => console.log(`[Webhook] Job ${job.id} has completed!`));
webhookWorker.on('failed', (job, err) => console.error(`[Webhook] Job ${job?.id} has failed with ${err.message}`));

console.log('Workers started successfully!');

// Example of how WorkflowDAG could be used
const workflow = new WorkflowDAG();
workflow.addNode('node1', 'AgentExecute', { task: 'fetch_data' });
workflow.addNode('node2', 'Condition', { condition_var: 'success' });
workflow.addNode('node3', 'Delay', { delay_ms: 5000 });

workflow.addEdge('node1', 'node2');
workflow.addEdge('node2', 'node3', context => context.success === true);

console.log('Workflow loaded:', workflow.getInitialNodes());
