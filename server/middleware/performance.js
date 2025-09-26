// Performance monitoring middleware
export const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Log response details
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    originalEnd.apply(this, args);
  };
  
  next();
};

// Database performance monitoring
export const dbPerformanceMonitor = () => {
  import('mongoose').then(mongoose => {
  
  // Log slow queries
  mongoose.set('debug', (collectionName, method, query, doc) => {
    const start = Date.now();
    console.log(`DB Query: ${collectionName}.${method}`, query);
    
    return function() {
      const duration = Date.now() - start;
      if (duration > 500) {
        console.warn(`🐌 Slow DB query: ${collectionName}.${method} - ${duration}ms`);
      }
    };
  });
  }).catch(err => console.log('Mongoose not available for monitoring'));
};

// Memory usage monitoring
export const memoryMonitor = () => {
  setInterval(() => {
    const usage = process.memoryUsage();
    const memoryInMB = {
      rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
      external: Math.round(usage.external / 1024 / 1024 * 100) / 100
    };
    
    // Log if memory usage is high
    if (memoryInMB.heapUsed > 100) {
      console.warn('⚠️ High memory usage:', memoryInMB);
    }
  }, 30000); // Check every 30 seconds
};
