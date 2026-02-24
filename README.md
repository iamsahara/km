# KM App

Kitchen workflow portal built with Next.js (App Router) and TypeScript.

## Prerequisites

- Node.js `20+`
- npm `10+`

## Run The App

1. Install dependencies:

```bash
npm install
```

1. Start development server:

```bash
npm run dev
```

1. Open:

```text
http://localhost:3000/login
```

1. Production build and run:

```bash
npm run build
npm run start
```

## App Run Structure

1. User enters at `/login`.
1. Role is passed in query params (`?role=manager` or `?role=staff`).
1. `/dashboard` is the main hub.

Main feature routes:

- `/orders`
- `/pending-orders`
- `/inventory`
- `/reminders`
- `/messages`
- `/tasks`
- `/manager/issues`

## App Structure

```text
src/
  app/
    layout.tsx
    login/page.tsx
    dashboard/page.tsx
    orders/page.tsx
    pending-orders/page.tsx
    inventory/page.tsx
    reminders/page.tsx
    messages/page.tsx
    tasks/page.tsx
    manager/issues/page.tsx
  components/
    kitchen-state-provider.tsx
    portal-shell.tsx
    dashboard-page-client.tsx
    inventory-page-client.tsx
    messages-page-client.tsx
    pending-orders-page-client.tsx
    reminders-page-client.tsx
    tasks-page-client.tsx
  lib/
    mock-data.ts
    role.ts
```

## NPM Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```
