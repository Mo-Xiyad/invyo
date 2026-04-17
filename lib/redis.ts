import { Redis } from '@upstash/redis'

let cached: Redis | null = null

/** Upstash client (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). */
export function getRedis(): Redis {
  if (!cached) {
    cached = Redis.fromEnv()
  }
  return cached
}
