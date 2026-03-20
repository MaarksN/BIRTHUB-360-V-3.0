import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const createQueue = (name) => new Queue(name, { connection });
export const createWorker = (name, processor, options = {}) => new Worker(name, processor, { connection, ...options });
export const createQueueEvents = (name) => new QueueEvents(name, { connection });

// Pre-defined queues
export const agentQueue = createQueue('agent-execute');
export const emailQueue = createQueue('send-email');
export const webhookQueue = createQueue('send-webhook');
