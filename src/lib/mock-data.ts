export type Role = "manager" | "staff";

export type TaskStatus = "open" | "in-progress" | "done";

export type Task = {
  id: string;
  title: string;
  station: string;
  due: string;
  assignee: string;
  priority: "High" | "Medium" | "Low";
  status: TaskStatus;
  notes: string;
};

export type Reminder = {
  id: string;
  title: string;
  time: string;
  owner: string;
};

export type Notification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  level: "warning" | "alert" | "info";
};

export type Message = {
  id: string;
  sender: string;
  time: string;
  message: string;
};

export type InventoryAlert = {
  id: string;
  item: string;
  status: "Critical" | "Watch" | "Missing";
  detail: string;
};

export type Issue = {
  id: string;
  title: string;
  owner: string;
  detail: string;
  severity: "High" | "Medium" | "Low";
};

export const initialTasks: Task[] = [
  {
    id: "T-204",
    title: "Prep veg for lunch service",
    station: "Cold Prep",
    due: "10:30 AM",
    assignee: "Nina",
    priority: "High",
    status: "in-progress",
    notes: "Cucumber, tomato, herbs",
  },
  {
    id: "T-205",
    title: "Check seafood delivery",
    station: "Receiving",
    due: "11:00 AM",
    assignee: "Marcus",
    priority: "Medium",
    status: "open",
    notes: "Verify temp and count",
  },
  {
    id: "T-206",
    title: "Restock saute station",
    station: "Line",
    due: "11:15 AM",
    assignee: "Ava",
    priority: "Low",
    status: "open",
    notes: "Butter, shallots, wine",
  },
  {
    id: "T-207",
    title: "Log missing items",
    station: "Inventory",
    due: "12:00 PM",
    assignee: "Omar",
    priority: "High",
    status: "open",
    notes: "Track shortages and causes",
  },
];

export const initialReminders: Reminder[] = [
  {
    id: "R-01",
    title: "Defrost chicken",
    time: "2:00 PM",
    owner: "Line",
  },
  {
    id: "R-02",
    title: "Sanitize prep sinks",
    time: "3:30 PM",
    owner: "Prep",
  },
];

export const initialNotifications: Notification[] = [
  {
    id: "N-901",
    title: "Low stock: Arborio rice",
    detail: "Only 3 kg remaining. Reorder suggested.",
    time: "15 min ago",
    level: "warning",
  },
  {
    id: "N-902",
    title: "Task overdue: Stock broth",
    detail: "Assigned to Marcus, due at 9:30 AM.",
    time: "42 min ago",
    level: "alert",
  },
  {
    id: "N-903",
    title: "Reminder sent to Ava",
    detail: "Restock saute station by 11:15 AM.",
    time: "1 hr ago",
    level: "info",
  },
];

export const initialMessages: Message[] = [
  {
    id: "M-01",
    sender: "Manager",
    time: "9:10 AM",
    message: "Focus on zero waste during lunch shift.",
  },
  {
    id: "M-02",
    sender: "Nina",
    time: "9:34 AM",
    message: "Cold prep done early. Need more basil.",
  },
];

export const inventoryAlerts: InventoryAlert[] = [
  {
    id: "I-1",
    item: "Basil",
    status: "Critical",
    detail: "Less than 1 kg",
  },
  {
    id: "I-2",
    item: "Olive oil",
    status: "Watch",
    detail: "5 liters remaining",
  },
  {
    id: "I-3",
    item: "Beef stock",
    status: "Missing",
    detail: "Not logged in today",
  },
];

export const issues: Issue[] = [
  {
    id: "ISS-11",
    title: "Missing order entry",
    owner: "Omar",
    detail: "Seafood delivery not logged",
    severity: "High",
  },
  {
    id: "ISS-12",
    title: "Incomplete checklist",
    owner: "Ava",
    detail: "Station cleaning skipped",
    severity: "Medium",
  },
  {
    id: "ISS-13",
    title: "Late reminder confirmation",
    owner: "Marcus",
    detail: "Broth prep confirmation late",
    severity: "Low",
  },
];
