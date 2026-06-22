# Redis Configuration Guide for Medusa 2.15.5

## Summary

This document provides a complete reference for configuring Redis-related modules in Medusa 2.15.5, including:
- Available Redis packages and their purposes
- Exact configuration syntax for `medusa-config.ts`
- Environment variable setup
- Module structure and dependencies

---

## 📦 Available Redis Modules

### Core Infrastructure Modules

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `@medusajs/caching` | 2.15.5 | New caching module (main) | ✅ Current (v2.11.0+) |
| `@medusajs/caching-redis` | 2.15.5 | Redis provider for Caching Module | ✅ Current |
| `@medusajs/event-bus-redis` | 2.15.5 | Redis-based event bus (pub/sub) | ✅ Current |
| `@medusajs/cache-redis` | 2.15.5 | Old Redis cache implementation | ⚠️ Deprecated |
| `@medusajs/cache-inmemory` | 2.15.5 | In-memory cache (non-Redis) | ✅ Alternative |
| `@medusajs/event-bus-local` | 2.15.5 | Local event bus (non-Redis) | ✅ Alternative |
| `@medusajs/locking-redis` | 2.15.5 | Redis-based distributed locking | 🔄 Optional |

### Dependencies

- **Framework**: `@medusajs/framework@2.15.5` (peerDependency for all modules)
- **Redis Client**: `ioredis@^5.4.1` (optional, used by Medusa internally)
- **CLI**: `@medusajs/cli@2.15.5` (for code generation)

---

## ⚙️ Configuration in `medusa-config.ts`

### 1. Redis Caching Module (NEW - Recommended for Production)

**Enable Feature Flag First:**
```env
MEDUSA_FF_CACHING=true
```

**Configuration:**
```typescript
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        ttl: 3600, // Default TTL in seconds (1 hour)
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
            is_default: true, // Makes this the default provider
            options: {
              redisUrl: process.env.CACHE_REDIS_URL,
              // Optional: add ioredis options
              // redisOptions: { 
              //   retryStrategy: (times) => Math.min(times * 50, 2000)
              // }
            },
          },
        ],
      },
    },
  ],
})
```

**What Gets Cached:**
- Product information
- Variant price sets
- Shipping options
- Regions
- Promotion codes
- Sales channels
- Customer data
- Cart operations (performance critical)

---

### 2. Redis Event Bus Module (Recommended for Production)

**Configuration:**
```typescript
import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    // ... rest of projectConfig
  },
  modules: [
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.EVENTS_REDIS_URL,
        queueName: "events-queue", // Default: "events-queue"
        
        // Production-recommended options
        jobOptions: {
          removeOnComplete: {
            // Keep completed jobs for 1 hour or up to 1000 jobs
            age: 3600,
            count: 1000,
          },
          removeOnFail: {
            // Keep failed jobs for 1 hour or up to 1000 jobs
            age: 3600,
            count: 1000,
          },
        },
        
        // Optional: Redis client configuration
        // redisOptions: {
        //   maxRetriesPerRequest: null,
        //   retryStrategy: (times) => Math.min(times * 50, 2000)
        // },
      },
    },
  ],
})
```

**Technology Stack:**
- Uses BullMQ for message queuing
- Uses ioredis as underlying Redis client
- Suitable for production environments

---

### 3. Complete Example with Both Modules

```typescript
import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    // Caching Module with Redis
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
            is_default: true,
            options: {
              redisUrl: process.env.CACHE_REDIS_URL || process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    // Event Bus Module with Redis
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.EVENTS_REDIS_URL || process.env.REDIS_URL,
        jobOptions: {
          removeOnComplete: {
            age: 3600,
            count: 1000,
          },
          removeOnFail: {
            age: 3600,
            count: 1000,
          },
        },
      },
    },
  ],
})
```

---

## 🌍 Environment Variables

### Required Variables

```env
# General Redis connection (fallback)
REDIS_URL=redis://localhost:6379

# Caching Module specific
CACHE_REDIS_URL=redis://localhost:6379
MEDUSA_FF_CACHING=true

# Event Bus Module specific
EVENTS_REDIS_URL=redis://localhost:6379

# Other required variables
DATABASE_URL=postgres://user:password@localhost/database
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:5173
AUTH_CORS=http://localhost:5173
JWT_SECRET=your-secret-key
COOKIE_SECRET=your-secret-key
```

### Current .env Configuration

```env
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
AUTH_MFA_ENCRYPTION_KEY=86e5f700dd43dd5e072960123cb6f2454adad4ee60846b9be837b488434298de
DATABASE_URL=postgres://postgres:hello@localhost/med1_db
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=my-medusa-store\apps\storefront
```

---

## 🏗️ Module Structure in Project

### Workspace Structure
```
apps/backend/
├── .medusa/
│   └── types/
│       └── modules-bindings.d.ts  (Generated module type definitions)
├── medusa-config.ts               (Configuration file)
├── package.json                   (Dependencies)
├── pnpm-lock.yaml                 (Lock file with all packages)
├── .env                           (Environment variables)
├── .env.template                  (Template for environment)
└── src/
    ├── modules/                   (Custom modules directory)
    ├── api/                       (API routes)
    ├── workflows/                 (Business logic workflows)
    └── subscribers/               (Event subscribers)
```

### Available Module Types in Framework

The `.medusa/types/modules-bindings.d.ts` file declares these core modules:

```typescript
interface ModuleImplementations {
  'cache': ICacheService,              // For Caching Module
  'event_bus': IEventBusModuleService, // For Event Module
  'locking': ILockingModule,           // For Locking Module
  // ... other commerce and infrastructure modules
}
```

---

## ✅ Production Recommendations

### For Redis Caching:
1. ✅ Use `@medusajs/medusa/caching` with `@medusajs/caching-redis` provider
2. ✅ Set `MEDUSA_FF_CACHING=true` feature flag
3. ✅ Enable cache invalidation for product updates
4. ✅ Monitor cache hit/miss ratios

### For Redis Event Bus:
1. ✅ Use `@medusajs/medusa/event-bus-redis` 
2. ✅ Configure job cleanup options (removeOnComplete, removeOnFail)
3. ✅ Run separate worker processes in production
4. ✅ Use appropriate worker mode (shared/worker/server)

### Infrastructure:
1. ✅ Use separate Redis instances for cache and events (optional but recommended)
2. ✅ Configure Redis persistence (RDB/AOF)
3. ✅ Set up Redis replication for high availability
4. ✅ Monitor Redis memory usage and eviction policies

---

## 🔄 Migration from Deprecated Cache Module

If upgrading from the old Cache Module:

**Old (Deprecated):**
```typescript
{
  resolve: "@medusajs/cache-redis", // Deprecated
  options: {
    redisUrl: process.env.REDIS_URL,
  },
}
```

**New (Current):**
```typescript
{
  resolve: "@medusajs/medusa/caching",
  options: {
    providers: [
      {
        resolve: "@medusajs/caching-redis",
        id: "caching-redis",
        is_default: true,
        options: {
          redisUrl: process.env.CACHE_REDIS_URL,
        },
      },
    ],
  },
}
```

---

## 🚀 Testing the Setup

Start the Medusa development server:
```bash
pnpm dev
```

Look for these log messages:
```
Connection to Redis in module 'event-redis' established
Caching module initialized with Redis provider
```

---

## 📚 References

- [Medusa Caching Module Docs](https://docs.medusajs.com/resources/infrastructure-modules/caching)
- [Medusa Event Module Docs](https://docs.medusajs.com/resources/infrastructure-modules/event/redis)
- [Medusa Modules Guide](https://docs.medusajs.com/learn/fundamentals/modules)
- [Redis Caching Provider](https://docs.medusajs.com/resources/infrastructure-modules/caching/providers/redis)
- [BullMQ Documentation](https://bullmq.io/)

---

## 📝 Notes

- Medusa 2.15.5 includes both deprecated Cache Module and new Caching Module
- The new Caching Module is recommended for all new projects and migrations
- Redis is optional; you can use alternatives like Memcached or in-memory stores
- Feature flags (`MEDUSA_FF_*`) enable experimental features and must be explicitly enabled
- Different Redis instances can be used for caching and events to improve isolation

