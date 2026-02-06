"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ChecklistTask = {
  id: string;
  title: string;
  station: string;
  due: string;
  assignee: string;
  priority: "High" | "Medium" | "Low";
  checklist: Array<{
    id: string;
    label: string;
    done: boolean;
  }>;
};

export type CompletedTask = ChecklistTask & {
  completedBy: string;
  completedAt: string;
};

export type SupplyOrder = {
  id: string;
  vendor: string;
  eta: string;
  phase: "order" | "receiving" | "received";
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
};

export type InventoryCategory =
  | "Produce"
  | "Meat & Seafood"
  | "Dairy & Eggs"
  | "Pantry & Dry Goods"
  | "Frozen"
  | "Beverages"
  | "Cleaning & Sanitation"
  | "Care Supplies";

export type InventoryService = "Breakfast" | "Lunch" | "Dinner" | "Events";

export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  section: "Kitchen" | "Storage" | "Housekeeping" | "Care Unit";
  services: InventoryService[];
  onHand: number;
  unit: string;
  reorderLevel: number;
};

export type InventoryLog = {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  source: string;
  by: string;
  at: string;
};

export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  level: "warning" | "alert" | "info";
  kind: "low-stock" | "system";
  itemId?: string;
};

type KitchenStateValue = {
  activeTasks: ChecklistTask[];
  completedTasks: CompletedTask[];
  supplyOrders: SupplyOrder[];
  inventory: InventoryItem[];
  inventoryLog: InventoryLog[];
  notifications: AppNotification[];
  notifyLowStock: (itemId: string) => void;
  addSupplyOrder: (input: {
    vendor: string;
    eta: string;
    items: Array<{ name: string; quantity: number; unit: string }>;
  }) => void;
  toggleChecklistItem: (taskId: string, checklistItemId: string) => void;
  completeTask: (taskId: string, completedBy: string) => void;
  moveOrderToReceiving: (orderId: string) => void;
  receiveOrder: (orderId: string, receivedBy: string) => void;
};

type PersistedState = {
  activeTasks: ChecklistTask[];
  completedTasks: CompletedTask[];
  supplyOrders: SupplyOrder[];
  inventory: InventoryItem[];
  inventoryLog: InventoryLog[];
  notifications: AppNotification[];
};

const STORAGE_KEY = "kitchryn-state-v1";

const initialInventory: InventoryItem[] = [
  {
    id: "INV-1",
    name: "Basil",
    category: "Produce",
    section: "Kitchen",
    services: ["Breakfast", "Lunch", "Dinner", "Events"],
    onHand: 1,
    unit: "kg",
    reorderLevel: 2,
  },
  {
    id: "INV-2",
    name: "Tomato",
    category: "Produce",
    section: "Kitchen",
    services: ["Breakfast", "Lunch", "Dinner", "Events"],
    onHand: 12,
    unit: "kg",
    reorderLevel: 8,
  },
  {
    id: "INV-3",
    name: "Sea bass",
    category: "Meat & Seafood",
    section: "Kitchen",
    services: ["Lunch", "Dinner", "Events"],
    onHand: 4,
    unit: "kg",
    reorderLevel: 6,
  },
  {
    id: "INV-4",
    name: "Shrimp",
    category: "Meat & Seafood",
    section: "Kitchen",
    services: ["Lunch", "Dinner", "Events"],
    onHand: 2,
    unit: "kg",
    reorderLevel: 5,
  },
  {
    id: "INV-5",
    name: "Eggs",
    category: "Dairy & Eggs",
    section: "Storage",
    services: ["Breakfast", "Lunch", "Dinner"],
    onHand: 280,
    unit: "pcs",
    reorderLevel: 180,
  },
  {
    id: "INV-6",
    name: "Milk",
    category: "Dairy & Eggs",
    section: "Storage",
    services: ["Breakfast", "Lunch", "Dinner"],
    onHand: 42,
    unit: "L",
    reorderLevel: 20,
  },
  {
    id: "INV-7",
    name: "Olive oil",
    category: "Pantry & Dry Goods",
    section: "Storage",
    services: ["Breakfast", "Lunch", "Dinner", "Events"],
    onHand: 5,
    unit: "L",
    reorderLevel: 6,
  },
  {
    id: "INV-8",
    name: "Rice",
    category: "Pantry & Dry Goods",
    section: "Storage",
    services: ["Lunch", "Dinner", "Events"],
    onHand: 40,
    unit: "kg",
    reorderLevel: 20,
  },
  {
    id: "INV-9",
    name: "Pasta",
    category: "Pantry & Dry Goods",
    section: "Storage",
    services: ["Lunch", "Dinner", "Events"],
    onHand: 34,
    unit: "kg",
    reorderLevel: 14,
  },
  {
    id: "INV-10",
    name: "Frozen vegetables",
    category: "Frozen",
    section: "Storage",
    services: ["Lunch", "Dinner", "Events"],
    onHand: 22,
    unit: "kg",
    reorderLevel: 10,
  },
  {
    id: "INV-11",
    name: "Frozen berries",
    category: "Frozen",
    section: "Storage",
    services: ["Breakfast", "Events"],
    onHand: 15,
    unit: "kg",
    reorderLevel: 8,
  },
  {
    id: "INV-12",
    name: "Orange juice",
    category: "Beverages",
    section: "Storage",
    services: ["Breakfast", "Lunch", "Dinner", "Events"],
    onHand: 26,
    unit: "L",
    reorderLevel: 12,
  },
  {
    id: "INV-13",
    name: "Tea bags",
    category: "Beverages",
    section: "Storage",
    services: ["Breakfast", "Lunch", "Dinner", "Events"],
    onHand: 400,
    unit: "pcs",
    reorderLevel: 200,
  },
  {
    id: "INV-14",
    name: "Surface sanitizer",
    category: "Cleaning & Sanitation",
    section: "Housekeeping",
    services: ["Breakfast", "Lunch", "Dinner", "Events"],
    onHand: 14,
    unit: "L",
    reorderLevel: 10,
  },
  {
    id: "INV-15",
    name: "Kitchen gloves",
    category: "Cleaning & Sanitation",
    section: "Kitchen",
    services: ["Breakfast", "Lunch", "Dinner", "Events"],
    onHand: 90,
    unit: "pcs",
    reorderLevel: 60,
  },
  {
    id: "INV-16",
    name: "Nutrition shakes",
    category: "Care Supplies",
    section: "Care Unit",
    services: ["Breakfast", "Lunch", "Dinner"],
    onHand: 48,
    unit: "bottles",
    reorderLevel: 24,
  },
  {
    id: "INV-17",
    name: "Thickener powder",
    category: "Care Supplies",
    section: "Care Unit",
    services: ["Breakfast", "Lunch", "Dinner"],
    onHand: 9,
    unit: "kg",
    reorderLevel: 6,
  },
];

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function inferInventoryCategory(name: string): InventoryCategory {
  const value = name.toLowerCase();

  if (/(fish|shrimp|beef|chicken|lamb|meat|seafood|salmon|bass)/.test(value)) {
    return "Meat & Seafood";
  }
  if (/(milk|cheese|butter|egg|yogurt|cream)/.test(value)) {
    return "Dairy & Eggs";
  }
  if (/(frozen|ice cream|berries)/.test(value)) {
    return "Frozen";
  }
  if (/(juice|tea|coffee|water|drink)/.test(value)) {
    return "Beverages";
  }
  if (/(sanitizer|soap|detergent|glove|clean)/.test(value)) {
    return "Cleaning & Sanitation";
  }
  if (/(shake|supplement|thickener|medical|care)/.test(value)) {
    return "Care Supplies";
  }
  if (/(rice|pasta|flour|oil|salt|sugar|spice|lentil|bean)/.test(value)) {
    return "Pantry & Dry Goods";
  }

  return "Produce";
}

function sectionForCategory(category: InventoryCategory): InventoryItem["section"] {
  if (category === "Cleaning & Sanitation") return "Housekeeping";
  if (category === "Care Supplies") return "Care Unit";
  if (category === "Pantry & Dry Goods" || category === "Frozen" || category === "Beverages") {
    return "Storage";
  }
  return "Kitchen";
}

function servicesForCategory(category: InventoryCategory): InventoryService[] {
  if (category === "Cleaning & Sanitation") return ["Breakfast", "Lunch", "Dinner", "Events"];
  if (category === "Care Supplies") return ["Breakfast", "Lunch", "Dinner"];
  if (category === "Beverages") return ["Breakfast", "Lunch", "Dinner", "Events"];
  if (category === "Dairy & Eggs") return ["Breakfast", "Lunch", "Dinner"];
  if (category === "Produce") return ["Breakfast", "Lunch", "Dinner", "Events"];
  if (category === "Meat & Seafood") return ["Lunch", "Dinner", "Events"];
  if (category === "Pantry & Dry Goods" || category === "Frozen") {
    return ["Breakfast", "Lunch", "Dinner", "Events"];
  }
  return ["Breakfast", "Lunch", "Dinner"];
}

function buildLowStockNotifications(inventory: InventoryItem[]): AppNotification[] {
  return inventory
    .filter((item) => item.onHand <= item.reorderLevel)
    .map((item) => ({
      id: `LOW-${item.id}`,
      title: `Low stock: ${item.name}`,
      detail: `${item.onHand} ${item.unit} remaining. Reorder level is ${item.reorderLevel} ${item.unit}.`,
      time: "Now",
      level: "warning",
      kind: "low-stock",
      itemId: item.id,
    }));
}

const initialState: PersistedState = {
  activeTasks: [
    {
      id: "T-301",
      title: "Prep veg for lunch service",
      station: "Cold Prep",
      due: "10:30 AM",
      assignee: "Nina",
      priority: "High",
      checklist: [
        { id: "T-301-C1", label: "Wash produce", done: false },
        { id: "T-301-C2", label: "Cut vegetables", done: false },
        { id: "T-301-C3", label: "Label containers", done: false },
      ],
    },
    {
      id: "T-302",
      title: "Check seafood delivery",
      station: "Receiving",
      due: "11:00 AM",
      assignee: "Marcus",
      priority: "High",
      checklist: [
        { id: "T-302-C1", label: "Check temperature", done: false },
        { id: "T-302-C2", label: "Check quantity", done: false },
        { id: "T-302-C3", label: "Sign invoice", done: false },
      ],
    },
    {
      id: "T-303",
      title: "Restock saute station",
      station: "Line",
      due: "11:15 AM",
      assignee: "Ava",
      priority: "Medium",
      checklist: [
        { id: "T-303-C1", label: "Refill butter", done: false },
        { id: "T-303-C2", label: "Refill shallots", done: false },
        { id: "T-303-C3", label: "Refill cooking wine", done: false },
      ],
    },
  ],
  completedTasks: [],
  supplyOrders: [
    {
      id: "PO-410",
      vendor: "Harbor Seafood",
      eta: "Today 12:30 PM",
      phase: "order",
      items: [
        { id: "IT-1", name: "Sea bass", quantity: 18, unit: "kg" },
        { id: "IT-2", name: "Shrimp", quantity: 10, unit: "kg" },
      ],
    },
    {
      id: "PO-411",
      vendor: "Greenleaf Produce",
      eta: "Today 2:00 PM",
      phase: "receiving",
      items: [
        { id: "IT-3", name: "Basil", quantity: 6, unit: "kg" },
        { id: "IT-4", name: "Tomato", quantity: 20, unit: "kg" },
      ],
    },
  ],
  inventory: initialInventory,
  inventoryLog: [],
  notifications: buildLowStockNotifications(initialInventory),
};

const KitchenStateContext = createContext<KitchenStateValue | null>(null);

function nextOrderId(orders: SupplyOrder[]): string {
  const max = orders.reduce((acc, order) => {
    const numeric = Number(order.id.replace("PO-", ""));
    return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
  }, 400);

  return `PO-${max + 1}`;
}

function nextOrderItemId(orders: SupplyOrder[]): string {
  const max = orders.reduce((acc, order) => {
    for (const item of order.items) {
      const numeric = Number(item.id.replace("IT-", ""));
      if (Number.isFinite(numeric)) {
        acc = Math.max(acc, numeric);
      }
    }
    return acc;
  }, 0);

  return `IT-${max + 1}`;
}

function normalizePersistedState(parsed: PersistedState): PersistedState {
  const parsedWithOptional = parsed as PersistedState & {
    notifications?: AppNotification[];
    inventory?: Array<
      InventoryItem & {
        category?: InventoryCategory;
        section?: InventoryItem["section"];
        services?: InventoryService[];
      }
    >;
  };

  return {
    ...parsed,
    inventory: (parsedWithOptional.inventory || initialInventory).map((item) => {
      const category = item.category ?? inferInventoryCategory(item.name);
      return {
        ...item,
        category,
        section: item.section ?? sectionForCategory(category),
        services: item.services ?? servicesForCategory(category),
      };
    }),
    activeTasks: parsed.activeTasks.map((task) => ({
      ...task,
      checklist: task.checklist.map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `${task.id}-C${index + 1}`,
            label: item,
            done: false,
          };
        }
        return item;
      }),
    })),
    completedTasks: parsed.completedTasks.map((task) => ({
      ...task,
      checklist: task.checklist.map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `${task.id}-C${index + 1}`,
            label: item,
            done: true,
          };
        }
        return item;
      }),
    })),
    notifications: Array.isArray(parsedWithOptional.notifications)
      ? parsedWithOptional.notifications
      : buildLowStockNotifications(parsedWithOptional.inventory || initialInventory),
  };
}

export function KitchenStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = normalizePersistedState(JSON.parse(raw) as PersistedState);
      const timer = window.setTimeout(() => {
        setState(parsed);
      }, 0);
      return () => window.clearTimeout(timer);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleChecklistItem = useCallback((taskId: string, checklistItemId: string) => {
    setState((prev) => ({
      ...prev,
      activeTasks: prev.activeTasks.map((task) =>
        task.id !== taskId
          ? task
          : {
              ...task,
              checklist: task.checklist.map((item) =>
                item.id === checklistItemId ? { ...item, done: !item.done } : item
              ),
            }
      ),
    }));
  }, []);

  const notifyLowStock = useCallback((itemId: string) => {
    setState((prev) => {
      const item = prev.inventory.find((entry) => entry.id === itemId);
      if (!item) return prev;

      return {
        ...prev,
        notifications: [
          {
            id: `LOW-${item.id}-${Date.now()}`,
            title: `Low stock: ${item.name}`,
            detail: `${item.onHand} ${item.unit} remaining. Reorder level is ${item.reorderLevel} ${item.unit}.`,
            time: nowLabel(),
            level: "warning",
            kind: "low-stock",
            itemId: item.id,
          },
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const addSupplyOrder = useCallback(
    (input: {
      vendor: string;
      eta: string;
      items: Array<{ name: string; quantity: number; unit: string }>;
    }) => {
      setState((prev) => {
        const cleanVendor = input.vendor.trim();
        const cleanEta = input.eta.trim();
        const cleanItems = input.items
          .map((item) => ({
            name: item.name.trim(),
            quantity: Number(item.quantity),
            unit: item.unit.trim().toLowerCase() || "kg",
          }))
          .filter((item) => item.name && item.quantity > 0);

        if (!cleanVendor || cleanItems.length === 0) {
          return prev;
        }

        let currentItemNumber = Number(nextOrderItemId(prev.supplyOrders).replace("IT-", ""));

        const order: SupplyOrder = {
          id: nextOrderId(prev.supplyOrders),
          vendor: cleanVendor,
          eta: cleanEta || "Today",
          phase: "order",
          items: cleanItems.map((item) => {
            const mapped = {
              id: `IT-${currentItemNumber}`,
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
            };
            currentItemNumber += 1;
            return mapped;
          }),
        };

        return {
          ...prev,
          supplyOrders: [order, ...prev.supplyOrders],
        };
      });
    },
    []
  );

  const completeTask = useCallback((taskId: string, completedBy: string) => {
    setState((prev) => {
      const task = prev.activeTasks.find((item) => item.id === taskId);
      if (!task) return prev;
      if (!task.checklist.every((item) => item.done)) return prev;

      const completedTask: CompletedTask = {
        ...task,
        completedBy,
        completedAt: nowLabel(),
      };

      return {
        ...prev,
        activeTasks: prev.activeTasks.filter((item) => item.id !== taskId),
        completedTasks: [completedTask, ...prev.completedTasks],
      };
    });
  }, []);

  const moveOrderToReceiving = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      supplyOrders: prev.supplyOrders.map((order) =>
        order.id === orderId && order.phase === "order"
          ? { ...order, phase: "receiving" }
          : order
      ),
    }));
  }, []);

  const receiveOrder = useCallback((orderId: string, receivedBy: string) => {
    setState((prev) => {
      const order = prev.supplyOrders.find((item) => item.id === orderId);
      if (!order || order.phase !== "receiving") return prev;

      const nextInventory = [...prev.inventory];
      const nextLog = [...prev.inventoryLog];

      for (const orderItem of order.items) {
        const existing = nextInventory.find(
          (inventoryItem) => inventoryItem.name.toLowerCase() === orderItem.name.toLowerCase()
        );

        if (existing) {
          existing.onHand += orderItem.quantity;
        } else {
          const category = inferInventoryCategory(orderItem.name);
          nextInventory.push({
            id: `INV-${nextInventory.length + 1}`,
            name: orderItem.name,
            category,
            section: sectionForCategory(category),
            services: servicesForCategory(category),
            onHand: orderItem.quantity,
            unit: orderItem.unit,
            reorderLevel: Math.max(1, Math.ceil(orderItem.quantity * 0.4)),
          });
        }

        nextLog.unshift({
          id: `LOG-${order.id}-${orderItem.id}`,
          itemName: orderItem.name,
          quantity: orderItem.quantity,
          unit: orderItem.unit,
          source: order.id,
          by: receivedBy,
          at: nowLabel(),
        });
      }

      const lowBefore = new Set(
        prev.inventory
          .filter((item) => item.onHand <= item.reorderLevel)
          .map((item) => item.id)
      );
      const lowAfter = new Set(
        nextInventory
          .filter((item) => item.onHand <= item.reorderLevel)
          .map((item) => item.id)
      );
      const nextNotifications = [...prev.notifications];

      for (const item of nextInventory) {
        if (!lowAfter.has(item.id) || lowBefore.has(item.id)) continue;
        nextNotifications.unshift({
          id: `LOW-${item.id}-${Date.now()}`,
          title: `Low stock: ${item.name}`,
          detail: `${item.onHand} ${item.unit} remaining. Reorder level is ${item.reorderLevel} ${item.unit}.`,
          time: nowLabel(),
          level: "warning",
          kind: "low-stock",
          itemId: item.id,
        });
      }

      return {
        ...prev,
        inventory: nextInventory,
        inventoryLog: nextLog,
        notifications: nextNotifications,
        supplyOrders: prev.supplyOrders.map((item) =>
          item.id === orderId ? { ...item, phase: "received" } : item
        ),
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      activeTasks: state.activeTasks,
      completedTasks: state.completedTasks,
      supplyOrders: state.supplyOrders,
      inventory: state.inventory,
      inventoryLog: state.inventoryLog,
      notifications: state.notifications,
      notifyLowStock,
      addSupplyOrder,
      toggleChecklistItem,
      completeTask,
      moveOrderToReceiving,
      receiveOrder,
    }),
    [
      state,
      notifyLowStock,
      addSupplyOrder,
      toggleChecklistItem,
      completeTask,
      moveOrderToReceiving,
      receiveOrder,
    ]
  );

  return <KitchenStateContext.Provider value={value}>{children}</KitchenStateContext.Provider>;
}

export function useKitchenState() {
  const ctx = useContext(KitchenStateContext);
  if (!ctx) {
    throw new Error("useKitchenState must be used within KitchenStateProvider");
  }

  return ctx;
}
