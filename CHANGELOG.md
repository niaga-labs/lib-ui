# Changelog

All notable changes to `lib-ui` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed - six exports subpaths were shadowed by their own wildcard (NIAGA-168)

- Six exact `exports` keys were listed **after** the wildcard covering the same directory, so a resolver
  taking the first match hit the wildcard, mapped to a `.tsx` file that does not exist, and failed:

  | Exact key | maps to | wildcard would hit |
  |---|---|---|
  | `./admin/categories/categories` | `categories.ts` | `categories.tsx` (absent) |
  | `./admin/collections/collections` | `collections.ts` | `collections.tsx` (absent) |
  | `./admin/content/banners` | `banners.ts` | `banners.tsx` (absent) |
  | `./admin/marketplace/marketplace` | `marketplace.ts` | `marketplace.tsx` (absent) |
  | `./admin/products/products` | `products.ts` | `products.tsx` (absent) |
  | `./admin/users/users` | `users.ts` | `users.tsx` (absent) |

- Each exact key now precedes its wildcard, which is what `./warehouse` and `./agent/dashboard` already did -
  this makes the file consistent with its own convention rather than inventing one.
- **All six have real importers** in `frontend-admin/src` (14 in total). Only `products` had surfaced,
  because `frontend-admin`'s build stopped at the first one.
- The failure was invisible in TypeScript: `tsc` honours exact-before-wildcard, so type-checking passed.
  Only webpack's resolver disagreed, and it did not fail the compile - it emitted a **throwing stub**
  (`Error("Cannot find module ...")` with `code = "MODULE_NOT_FOUND"`) into the server chunk, deferring the
  error to prerender.

### Notes

- Linked into the frontends as `file:../lib-ui`, which npm symlinks rather than copies.
- **`npm install` must be run here before either frontend will build.** `tailwind.preset.ts` does `require("tailwindcss-animate")`, and Node resolves that from this directory — outside the frontend's `node_modules` — so the frontend's CSS build fails with `Cannot find module 'tailwindcss-animate'` until this repo is installed. Written up in `infra-platform/docs/LOCAL_DEV.md` (DMB-7).
