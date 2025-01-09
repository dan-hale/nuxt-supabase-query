# Nuxt Supabase Query

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A useAsyncData-like solution for Supabase select queries

<!-- - [✨ &nbsp;Release Notes](/CHANGELOG.md)-->
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-supabase-query?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- [x] Simpler API for cleaner code
- [x] Written on top of Postgrest-JS
- [x] Allow passing filters as a computed function, so re-fetching can occur if the query changes
- [x] Shared results from SSR for Hydration across instances
- [X] Support "count" as ref returned next to data
- [ ] Work with custom schemas
- [ ] Support useAsyncData options such as server, immediate, and watch
- [ ] Fully typed, including errors (since errors should always be Postgrest Errors)
- [ ] Offer an abstraction around range() for infinite scroll style loading

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-supabase-query
```

That's it! You can now use Nuxt Supabase Query in your Nuxt app ✨

## Demo

Usage with [Nuxt Supabase Module](https://supabase.nuxtjs.org/)
```typescript
const supabase = useSupabaseClient()
const { data, count, error, status } = await useSupabaseQuery(
  supabase,
  'table',
  '*',
  filter => filter.eq('id', 'example'),
  {count: 'exact', single: false}
)
```

Usage with [Supabase-JS](https://supabase.com/docs/reference/javascript/initializing)

```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
const { data, count, error, status } = await useSupabaseQuery(
  supabase,
  'table',
  '*',
  filter => filter.eq('id', 'example'),
  {count: 'exact', single: false}
)

```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-supabase-query/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-supabase-query

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-supabase-query.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-supabase-query

[license-src]: https://img.shields.io/npm/l/nuxt-supabase-query.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-supabase-query

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
