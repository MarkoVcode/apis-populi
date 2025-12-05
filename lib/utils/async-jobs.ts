import { v4 as uuidv4 } from 'uuid';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AsyncJob<T = unknown> {
  id: string;
  status: JobStatus;
  progress: number;
  eta_seconds?: number;
  created_at: string;
  updated_at: string;
  result?: T;
  error?: { code: string; message: string };
  webhook_url?: string;
}

// In-memory job store
const jobStore = new Map<string, AsyncJob>();

export function createJob<T>(webhookUrl?: string): AsyncJob<T> {
  const job: AsyncJob<T> = {
    id: uuidv4(),
    status: 'pending',
    progress: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    webhook_url: webhookUrl,
  };

  jobStore.set(job.id, job as AsyncJob);
  return job;
}

export function getJob<T>(id: string): AsyncJob<T> | undefined {
  return jobStore.get(id) as AsyncJob<T> | undefined;
}

export function updateJob<T>(id: string, updates: Partial<AsyncJob<T>>): AsyncJob<T> | undefined {
  const job = jobStore.get(id);
  if (!job) return undefined;

  const updated = {
    ...job,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  jobStore.set(id, updated);
  return updated as AsyncJob<T>;
}

export function deleteJob(id: string): boolean {
  return jobStore.delete(id);
}

export function getAllJobs(): AsyncJob[] {
  return Array.from(jobStore.values());
}

// Process a job with random delay (20-50 seconds)
export async function processJob<T>(
  jobId: string,
  processor: () => Promise<T>,
  options: { onProgress?: (progress: number) => void } = {}
): Promise<void> {
  const job = getJob(jobId);
  if (!job) return;

  updateJob(jobId, { status: 'processing', progress: 0 });

  // Random processing time between 20-50 seconds
  const totalTime = Math.floor(Math.random() * 30000) + 20000;
  const startTime = Date.now();

  // Progress update interval
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(95, Math.floor((elapsed / totalTime) * 100));
    const etaSeconds = Math.ceil((totalTime - elapsed) / 1000);

    updateJob(jobId, { progress, eta_seconds: etaSeconds });
    options.onProgress?.(progress);
  }, 1000);

  try {
    // Wait for the random time then process
    await new Promise((resolve) => setTimeout(resolve, totalTime));

    const result = await processor();

    clearInterval(progressInterval);
    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      result,
      eta_seconds: 0,
    });

    // Send webhook if configured
    const completedJob = getJob(jobId);
    if (completedJob?.webhook_url) {
      sendWebhook(completedJob.webhook_url, completedJob);
    }
  } catch (error) {
    clearInterval(progressInterval);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    updateJob(jobId, {
      status: 'failed',
      progress: 0,
      error: { code: 'PROCESSING_ERROR', message: errorMessage },
    });

    // Send webhook for failure too
    const failedJob = getJob(jobId);
    if (failedJob?.webhook_url) {
      sendWebhook(failedJob.webhook_url, failedJob);
    }
  }
}

// Send webhook notification
async function sendWebhook(url: string, payload: AsyncJob): Promise<void> {
  try {
    const signature = generateWebhookSignature(JSON.stringify(payload));

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': new Date().toISOString(),
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Webhook delivery failed:', error);
  }
}

// Simple HMAC-like signature (in production would use crypto)
function generateWebhookSignature(payload: string): string {
  const secret = process.env.WEBHOOK_SECRET || 'webhook-secret';
  // Simple hash for demo - in production use crypto.createHmac
  let hash = 0;
  const str = secret + payload;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256=${Math.abs(hash).toString(16)}`;
}

// Cleanup completed jobs older than 1 hour
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
  for (const [id, job] of jobStore) {
    if ((job.status === 'completed' || job.status === 'failed') && job.updated_at < oneHourAgo) {
      jobStore.delete(id);
    }
  }
}, 300000); // Run every 5 minutes
