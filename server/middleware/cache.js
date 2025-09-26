import NodeCache from 'node-cache';

// Create cache instance with TTL of 15 minutes
const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

// Cache middleware for GET requests
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache_${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json to cache the response
    res.json = function(data) {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, data, duration);
      }
      originalJson.call(this, data);
    };

    next();
  };
};

// Clear cache by pattern
export const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  cache.del(matchingKeys);
};

// Get cache stats
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;

