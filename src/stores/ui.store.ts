import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,

        setSidebarOpen: (open) =>
          set({ sidebarOpen: open }, undefined, "ui/setSidebarOpen"),

        toggleSidebar: () =>
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            undefined,
            "ui/toggleSidebar",
          ),
      }),
      {
        name: "fieldops-ui",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
        skipHydration: true,
      },
    ),
    { name: "UIStore", enabled: process.env.NODE_ENV === "development" },
  ),
);
