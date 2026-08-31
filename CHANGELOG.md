# Changelog

All notable changes to `lib-ui` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Notes

- Linked into the frontends as `file:../lib-ui`, which npm symlinks rather than copies.
- **`npm install` must be run here before either frontend will build.** `tailwind.preset.ts` does `require("tailwindcss-animate")`, and Node resolves that from this directory — outside the frontend's `node_modules` — so the frontend's CSS build fails with `Cannot find module 'tailwindcss-animate'` until this repo is installed. Written up in `infra-platform/docs/LOCAL_DEV.md` (DMB-7).
