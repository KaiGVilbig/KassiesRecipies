# Kassie's Recipes - Development Guide

## Commands

### Development
```bash
npm run dev
```
- Starts Next.js dev server with Turbopack on `http://localhost:3000`
- Uses React 19 + Next.js 15

### Production Build
```bash
npm run build
npm run start
```
- `build`: Creates optimized `.next` directory
- `start`: Runs production server on `http://localhost:3000`

### Docker (Raspberry Pi ARM64)
```bash
docker buildx build --platform linux/arm64/v8 -t kassiesrecipies:latest --load .
docker save -o kassiesrecipies-arm64.tar kassiesrecipies:latest
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
```
- Runs Vitest test runner in watch mode
- Tests located in `tests/` directory
- Uses `@testing-library/react` for rendering and user interactions
- Tests wrapped in Redux `Provider` with `store`

### Test Setup
- `tests/setup.ts` - Test configuration and mocks
- `tests/Recipies.test.tsx` - E2E tests for recipe application
- Mocks for API endpoints (`/api/recipie`, `/api/conversion`)
- Test helper: `<Provider store={store}>` wrapper

### Testing Patterns
- Use `render()` with `Wrapper` component containing Redux Provider
- Use `fireEvent.click()`, `fireEvent.change()`, `fireEvent.blur()` for interactions
- Use `waitFor()` to wait for async operations
- Use `cleanup()` in `afterEach()` to clean up DOM
- Mock fetch globally for API tests

## Environment Setup

Create `.env.local` in root:
```bash
MONGODB_URI=mongodb://localhost:27017/recipies
```

## Architecture Overview

### Core Directories

**`app/`** - Next.js App Router
- `layout.tsx` - Root layout with Geist fonts
- `page.tsx` - Main page (Recipies list)
- `api/` - API routes

**`app/api/`** - API Routes
- `recipie/route.ts` - CRUD for recipes (POST with form data + file upload, GET)
- `conversion/` - Conversion endpoints
- `health/` - Health check
- `uploads/` - File upload handling

**`components/`** - Reusable Components
- `AddRecipieForm.tsx` - Recipe creation form
- `ModifyRecipieForm.tsx` - Recipe editing form
- `Recipies.tsx` - Recipe list display
- `ShowRecipie.tsx` - Single recipe view
- `Navbar.tsx` - Navigation
- `Layout.tsx` - Main layout wrapper
- `ui/` - Radix UI components (Button, Dialog, Form, Input, Label, Select, Navigation)

**`redux/features/`** - Redux Slices
- `recipieSlice.ts` - Recipe state (setRecipies, addRecipie, modifyRecipie)
- `conversionSlice.ts` - Conversion state
- `recipieListSlice.ts` - Recipe list state

**`models/`** - MongoDB Schemas
- `recipieModel.tsx` - Recipe schema
- `conversionsModel.tsx` - Conversion schema

**`interfaces/`** - TypeScript Interfaces
- `recipie.ts` - Recipe interface
- `ingredient.ts` - Ingredient interface
- `conversion.ts` - Conversion interface

**`utils/`** - Utilities
- `connectMongo.tsx` - MongoDB connection helper

## Key Implementation Details

### API Route Quirks
- `app/api/recipie/route.ts` uses `formData()` for file uploads
- Image uploads go to `uploads/` directory (relative to cwd)
- DELETE recipe not implemented yet (commented out)
- API returns 201 on success, 500 on errors
- Uses `mongoose.connect` with `family: 4` (IPv4)

### Redux Patterns
- State stored under `value.recipies` or `value.conversions`
- Use `getRecipies(state)` selector to access recipes
- Use `useAppSelector` instead of `useSelector`

### MongoDB
- Database: `recipies`
- Connection string in `connectMongo.tsx`
- Recipe schema: name, ingredients[], instructions[], image?, servings, cals

### Styling
- Tailwind CSS with `tailwindcss-animate` plugin
- Dark mode via class
- CSS variables for colors (defined in `globals.css`)
- Geist font family

### Form Handling
- `react-hook-form` + `zod` validation
- Form components in `components/ui/form.tsx`

## Notes

- Recipe name has typo: "Recipies" → should be "Recipes"
- No TypeScript strict null checks in API routes (uses `as unknown as` casts)
- Console.log used extensively in API routes
- No error handling for MongoDB connection failures

### Test Issues Fixed

- `Modal.tsx` - Added missing `import React` statement  
- `AddRecipieForm.tsx` - Fixed `aria-invalid` binding to use `fieldState.error` from FormField
- `AddRecipieForm.tsx` - Added `handleBlur` function to trigger validation on input blur
- `Recipies.tsx` - Mocked API responses in tests with proper recipe data
- `tests/Recipies.test.tsx` - Updated fetch mock to return proper recipe and conversion data
- `tests/Recipies.test.tsx` - Added Navbar to test wrapper for add modal tests
- `tests/Recipies.test.tsx` - Added `fireEvent.click` on menu button to open dropdown before clicking add button
- `AddRecipieForm.tsx` - Added ESLint disable comment for unused blur parameter
