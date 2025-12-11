14:29:43.236 Running build in Washington, D.C., USA (East) – iad1
14:29:43.237 Build machine configuration: 2 cores, 8 GB
14:29:43.367 Cloning github.com/Khrboshi/Havenly-2.1 (Branch: main, Commit: fdcfd69)
14:29:43.610 Cloning completed: 243.000ms
14:29:44.333 Restored build cache from previous deployment (m5gwGBcZYkwevAcTnDDBwzzEFqXD)
14:29:45.095 Running "vercel build"
14:29:45.521 Vercel CLI 49.1.2
14:29:45.851 Installing dependencies...
14:29:47.182 
14:29:47.183 up to date in 1s
14:29:47.184 
14:29:47.184 153 packages are looking for funding
14:29:47.184   run `npm fund` for details
14:29:47.213 Detected Next.js version: 14.2.5
14:29:47.219 Running "npm run build"
14:29:47.332 
14:29:47.332 > havenly-2-1@1.0.0 build
14:29:47.332 > next build
14:29:47.332 
14:29:48.143   ▲ Next.js 14.2.5
14:29:48.145 
14:29:48.213    Creating an optimized production build ...
14:29:48.951  ⚠ Found lockfile missing swc dependencies, run next locally to automatically patch
14:29:53.210  ⚠ Found lockfile missing swc dependencies, run next locally to automatically patch
14:29:54.383 Failed to compile.
14:29:54.384 
14:29:54.386 ./lib/supabase/middleware.ts:1:1
14:29:54.386 Module not found: Can't resolve '@supabase/auth-helpers-nextjs'
14:29:54.386 [0m[31m[1m>[22m[39m[90m 1 |[39m [36mimport[39m { createMiddlewareClient } [36mfrom[39m [32m"@supabase/auth-helpers-nextjs"[39m[33m;[39m[0m
14:29:54.387 [0m [90m   |[39m [31m[1m^[22m[39m[0m
14:29:54.387 [0m [90m 2 |[39m [36mimport[39m { [33mNextResponse[39m[33m,[39m type [33mNextRequest[39m } [36mfrom[39m [32m"next/server"[39m[33m;[39m[0m
14:29:54.387 [0m [90m 3 |[39m[0m
14:29:54.387 [0m [90m 4 |[39m [36mexport[39m [36masync[39m [36mfunction[39m updateSession(req[33m:[39m [33mNextRequest[39m[33m,[39m res[33m:[39m [33mNextResponse[39m) {[0m
14:29:54.389 
14:29:54.389 https://nextjs.org/docs/messages/module-not-found
14:29:54.389 
14:29:54.390 Import trace for requested module:
14:29:54.390 ./middleware.ts
14:29:54.390 
14:29:54.420 
14:29:54.420 > Build failed because of webpack errors
14:29:54.458 Error: Command "npm run build" exited with 1
