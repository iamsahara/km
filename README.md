# Kitchryn Hub

Interactive kitchen management MVP for hotel kitchens.

## Current MVP

- Mock login with two roles: `manager` and `staff`
- Multi-page flow (responsive web)
- Checklist-based task flow
- Completed task tracking with `completedBy` and time
- Order phase and receiving phase workflow
- Inventory auto-updates when receiving is confirmed
- Inventory receiving log
- Reminders
- In-app notifications
- Team messaging
- Manager-only issues dashboard

## Routes

- `/login`
- `/dashboard`
- `/tasks`
- `/inventory`
- `/reminders`
- `/messages`
- `/manager/issues`

Role is mocked through query params, for example: `/dashboard?role=manager`.

## Workflow Notes

- Tasks are checklists. When marked done, they are removed from active queue.
- Completion records who finished the task and when.
- Orders move from `order` to `receiving` phase in `/tasks`.
- Confirming `received` updates inventory quantities immediately.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local browser state via React Context + `localStorage`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
