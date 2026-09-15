# Movirax Admin Panel - Design & Architecture Pattern

This document outlines the standard design patterns, UI architecture, and technical caveats used when building the Movirax Admin Dashboard. It serves as the single source of truth for extending the admin panel.

## 1. Global UI & Theming Strategy

### Dark Mode Only
The admin panel is strictly locked to **Dark Mode**. All Light Mode switches and automatic system preferences have been explicitly removed from the UI.
- Standard background color: `bg-background` (which maps to `#0A0A0A` or deep black).
- **Glassmorphism / Frosted Glass:** 
  - Standard cards and modal overlays use: `bg-background/60 dark:bg-default-100/50 backdrop-blur-xl`.
  - Sidebars and Topbars use: `bg-background/80 backdrop-blur-xl`.
- **Semantic Red ("Danger"):** We override the default hot-pink "danger" color in HeroUI to be a professional, corporate red. Always use `color="danger"` for primary calls-to-action, active states, and destructive buttons.

### Generic Tailwind vs Native Components
**Do not use generic raw Tailwind divs or standard HTML tables.**
Always construct layouts using native HeroUI components:
- Replace `<div>` wrappers with `<Card>`, `<CardHeader>`, and `<CardBody>`.
- Replace `<table>` with HeroUI's `<Table>`, `<TableHeader>`, `<TableBody>`, and `<TableRow>`.
- Inputs must always use `variant="faded"` (e.g., `<Input variant="faded" />` or `<Select variant="faded" />`) to maintain a polished, slightly elevated look, rather than the flat "bordered" variant.

## 2. Technical Component Patterns & Fixes

### The HeroUI TypeScript TS2741 Fix
When using HeroUI structural components (like `<Table>`, `<TableHeader>`, `<TableBody>`, `<Modal>`) in Next.js 15 / React 18, you will consistently encounter the `TS2741: Property 'children' is missing` type error if you nest children normally.

**Incorrect (Causes TS2741):**
```tsx
<TableHeader>
  <TableColumn>Name</TableColumn>
</TableHeader>
```

**Correct (The Workaround):**
Always pass the children explicitly as an array to the `children` prop:
```tsx
<TableHeader children={[
  <TableColumn key="name" children="Name" />
]} />
<TableBody children={items.map(item => (
  <TableRow key={item.id} children={[
    <TableCell key="cell1" children={item.name} />
  ]} />
))} />
```

### Server Actions & Client Boundaries
When importing database functions (e.g., Supabase fetching) into a `'use client'` component, the Next.js Webpack compiler will crash if `next/headers` leaks into the client bundle.
- **Rule:** Any file in `src/lib/` or `src/actions/` that uses `next/headers` (or `createServerClient`) **must** begin with `'use server';`. This converts the file's exports into Server Actions and safely bridges the client-server gap without Webpack errors.

## 3. Global Error Handling & 404s

Unmatched paths under `/admin/*` without catch-all routes will naturally fall back to the **global** `src/app/not-found.tsx` and `src/app/error.tsx`. 
- Global error boundaries must inherit the premium dark mode HeroUI card design.
- **Smart "Return Home" Logic:** Always utilize `usePathname()` in error boundaries. If `pathname.startsWith('/admin')`, the "Return Home" button must redirect the user to `/admin` rather than the public `/` landing page.

## 4. Authentication Flow
- The Admin Layout (`src/app/admin/layout.tsx`) handles session validation.
- The Admin Login form (`/admin/login`) requires explicit path bypassing within the layout to avoid rendering the Sidebar/Topbar.
- **Logout:** Client-side logout triggers must bypass API routes if the API is absent, using `createClient().auth.signOut()` directly in the browser to clear the session instantly, followed by `router.refresh()` and `router.push('/admin/login')`.

## 5. Analytics Truth Source
Never use mock variables or secondary tables (like `user_profiles` which is meant for sub-accounts) for high-level metrics.
- "Total Users" must always be a `count` query on the primary `profiles` table.
- Use explicit counts (`cancelledSubscribers`, `activeSubscribers`) instead of ambiguous percentages.
