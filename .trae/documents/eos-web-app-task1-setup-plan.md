# Eos Web App — Task 1 (Project Setup & Configuration) Plan

## Summary
Finish Task 1 by completing the missing page modules and correcting the mock data module path so the app builds and runs locally with the requested Tailwind v4 + glassmorphism theme.

## Current State Analysis (Repo Truth)
- A Vite + React project already exists at [eos-frontend](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend).
- Dependencies requested in Task 1 are already installed in [package.json](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/package.json).
- Tailwind CSS v4 is already configured in [vite.config.js](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/vite.config.js) via `@tailwindcss/vite`.
- Theme + fonts + glassmorphism utilities are already present in [index.css](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/src/index.css).
- File architecture is mostly present under `src/` (api, components, store, pages).

### Gaps / Breakages
- `src/pages/Dashboard/Dashboard.jsx` is missing, but imported in [App.jsx](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/src/App.jsx#L13).
- `src/pages/Chat/Chat.jsx` is missing, but imported in [App.jsx](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/src/App.jsx#L14).
- Mock data imports expect `src/mock/products.js` (e.g. `../../mock/products`), but the repo currently has a file at `src/mock` (no extension) containing the mock data. This causes runtime/build failures in:
  - `src/pages/Browse/Browse.jsx`
  - `src/pages/Sell/Sell.jsx`
  - `src/pages/ProductDetail/ProductDetail.jsx`
  - `src/pages/Landing/Landing.jsx`

## Proposed Changes (Decision-Complete)

### 1) Fix mock module location
**Goal:** Make mock imports resolve as `src/mock/products.js` (per Task 1).

- Convert `src/mock` (file) into a folder `src/mock/`.
- Create `src/mock/products.js` and move the existing mock content into it (exporting the same symbols currently used: `products`, `categories`, `getProductById`, default export).
- Remove the old `src/mock` file (since it blocks creation of a `src/mock/` directory on most file systems).

**Files impacted**
- Create: `eos-frontend/src/mock/products.js`
- Delete: `eos-frontend/src/mock` (file)
- No import updates required if we keep `../../mock/products` working as-is.

### 2) Add missing pages referenced by routing
**Goal:** Ensure router imports compile and routes render.

- Create `src/pages/Dashboard/Dashboard.jsx`
- Create `src/pages/Chat/Chat.jsx`

**Implementation details**
- Keep pages minimal but styled with the project’s existing utilities (e.g. `glass`, `text-gradient`) from [index.css](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/src/index.css).
- Use `lucide-react` icons only if already used elsewhere; otherwise keep placeholders minimal.
- Ensure each page is a default export and the import paths in [App.jsx](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/src/App.jsx) remain valid.

### 3) Ensure Task 1 architecture exactly matches requested structure
**Goal:** Match the Task 1 checklist precisely.

- Confirm folders exist:
  - `src/pages/Chat/Chat.jsx`
  - `src/pages/Dashboard/Dashboard.jsx`
  - `src/mock/products.js`
- Confirm existing required files still present:
  - `src/api/axios.js`
  - `src/components/ui/*`
  - `src/components/layout/*`
  - `src/store/authStore.js`
  - `src/App.jsx`, `src/main.jsx`, `src/index.css`

## Assumptions & Decisions
- Keep `eos-frontend` as the Vite app root (since it already contains `index.html`, `vite.config.js`, and `package.json`).
- Do not introduce additional libraries beyond what’s already installed (no UI kits).
- Keep route structure in [App.jsx](file:///c:/Users/spide/OneDrive/Desktop/EOS/eos-frontend/src/App.jsx) unchanged; only add missing files so it compiles.

## Verification Steps (After Implementation)
Run from `eos-frontend/`:
- `npm install`
- `npm run dev` and verify:
  - Home route (`/`) loads without errors
  - Navigate to `/browse`, `/sell`, `/product/p1` uses mock data without import errors
  - `/dashboard` and `/chat` routes render (may require auth; if blocked, confirm the modules still compile)
- `npm run build` succeeds (ensures all imports resolve and Tailwind pipeline works).

