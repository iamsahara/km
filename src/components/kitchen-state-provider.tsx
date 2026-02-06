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
  checklist: string[];
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

export type InventoryItem = {
  id: string;
  name: string;
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

type KitchenStateValue = {
  activeTasks: ChecklistTask[];
  completedTasks: CompletedTask[];
  supplyOrders: SupplyOrder[];
  inventory: InventoryItem[];
  inventoryLog: InventoryLog[];
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
};

const STORAGE_KEY = "kitchryn-state-v1";

const initialState: PersistedState = {
  activeTasks: [
    {
      id: "T-301",
      title: "Prep veg for lunch service",
      station: "Cold Prep",
      due: "10:30 AM",
      assignee: "Nina",
      priority: "High",
      checklist: ["Wash produce", "Cut vegetables", "Label containers"],
    },
    {
      id: "T-302",
      title: "Check seafood delivery",
      station: "Receiving",
      due: "11:00 AM",
      assignee: "Marcus",
      priority: "High",
      checklist: ["Check temperature", "Check quantity", "Sign invoice"],
    },
    {
      id: "T-303",
      title: "Restock saute station",
      station: "Line",
      due: "11:15 AM",
      assignee: "Ava",
      priority: "Medium",
      checklist: ["Refill butter", "Refill shallots", "Refill cooking wine"],
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
  inventory: [
    { id: "INV-1", name: "Basil", onHand: 1, unit: "kg", reorderLevel: 2 },
    { id: "INV-2", name: "Tomato", onHand: 12, unit: "kg", reorderLevel: 8 },
    { id: "INV-3", name: "Olive oil", onHand: 5, unit: "L", reorderLevel: 6 },
    { id: "INV-4", name: "Sea bass", onHand: 4, unit: "kg", reorderLevel: 6 },
    { id: "INV-5", name: "Shrimp", onHand: 2, unit: "kg", reorderLevel: 5 },
  ],
  inventoryLog: [],
};

const KitchenStateContext = createContext<KitchenStateValue | null>(null);

function loadInitialState(): PersistedState {
  if (typeof window === "undefined") {
    return initialState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialState;
  }

  try {
    return JSON.parse(raw) as PersistedState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return initialState;
  }
}

export function KitchenStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeTask = useCallback((taskId: string, completedBy: string) => {
    setState((prev) => {
      const task = prev.activeTasks.find((item) => item.id === taskId);
      if (!task) return prev;

      const completedTask: CompletedTask = {
        ...task,
        completedBy,
        completedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
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
          nextInventory.push({
            id: `INV-${nextInventory.length + 1}`,
            name: orderItem.name,
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
          at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      }

      return {
        ...prev,
        inventory: nextInventory,
        inventoryLog: nextLog,
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
      completeTask,
      moveOrderToReceiving,
      receiveOrder,
    }),
    [state, completeTask, moveOrderToReceiving, receiveOrder]
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
