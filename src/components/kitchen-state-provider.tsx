"use client";

import { createContext, useContext, useMemo } from "react";

type KitchenStateContextValue = {
  loadedAt: string;
};

const KitchenStateContext = createContext<KitchenStateContextValue | undefined>(
  undefined
);

export function KitchenStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      loadedAt: new Date().toISOString(),
    }),
    []
  );

  return (
    <KitchenStateContext.Provider value={value}>
      {children}
    </KitchenStateContext.Provider>
  );
}

export function useKitchenState() {
  const context = useContext(KitchenStateContext);
  if (!context) {
    throw new Error("useKitchenState must be used inside KitchenStateProvider");
  }
  return context;
}
