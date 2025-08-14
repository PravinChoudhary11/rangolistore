// lib/db.js - Optimized Database connection utilities
import { PrismaClient } from '@prisma/client';

let prisma;
let isConnecting = false;
let connectionPromise = null;

// Enhanced Prisma configuration
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Additional configuration options
    errorFormat: 'pretty',
    transactionOptions: {
      maxWait: 5000, // 5 seconds max wait
      timeout: 10000, // 10 seconds timeout
    },
  });
}

// Singleton with connection management
if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  prisma = global.__prisma;
}

// Connection management with warmup
export async function ensureConnection() {
  if (connectionPromise) {
    return connectionPromise;
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return;
  }

  isConnecting = true;
  connectionPromise = (async () => {
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      connectionPromise = null;
      throw error;
    } finally {
      isConnecting = false;
    }
  })();

  return connectionPromise;
}

// Optimized retry with circuit breaker pattern
export async function withRetry(operation, maxRetries = 2, timeout = 5000) {
  let lastError;
  
  // Ensure connection before operation
  try {
    await ensureConnection();
  } catch (connError) {
    throw new Error(`Database connection failed: ${connError.message}`);
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Add operation timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      );
      
      const operationPromise = operation(prisma);
      const result = await Promise.race([operationPromise, timeoutPromise]);
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      // Don't retry on certain errors (unique constraint, not found, etc.)
      if (
        error.code === 'P2002' || // Unique constraint
        error.code === 'P2025' || // Record not found
        error.message.includes('timeout') ||
        error.message.includes('Operation timeout')
      ) {
        throw error;
      }
      
      // Exponential backoff with jitter
      if (attempt < maxRetries) {
        const baseDelay = Math.min(500 * Math.pow(2, attempt - 1), 2000);
        const jitter = Math.random() * 200;
        await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
      }
    }
  }
  
  throw lastError;
}

// Connection health check with caching
let healthCheckCache = { result: null, timestamp: 0 };
const HEALTH_CHECK_TTL = 30000; // 30 seconds

export async function checkDatabaseHealth() {
  const now = Date.now();
  
  // Return cached result if still valid
  if (healthCheckCache.result && (now - healthCheckCache.timestamp) < HEALTH_CHECK_TTL) {
    return healthCheckCache.result;
  }
  
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), 3000))
    ]);
    
    healthCheckCache = {
      result: { healthy: true },
      timestamp: now
    };
    
    return healthCheckCache.result;
  } catch (error) {
    const result = { healthy: false, error: error.message };
    healthCheckCache = {
      result,
      timestamp: now
    };
    
    return result;
  }
}

// Graceful disconnect
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected gracefully');
  } catch (error) {
    console.error('Error during database disconnect:', error);
  }
}

// Process cleanup
if (typeof process !== 'undefined') {
  process.on('beforeExit', disconnectDatabase);
  process.on('SIGINT', disconnectDatabase);
  process.on('SIGTERM', disconnectDatabase);
}

export { prisma };
export default prisma;