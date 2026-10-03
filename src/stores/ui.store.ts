import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface UIState {
  // state
  sidebarOpen: boolean;
  // actions
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
        name: "fieldops-ui", // the localStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ sidebarOpen: state.sidebarOpen }), // save data, never functions
        skipHydration: true, // we load it manually after mount (explained in 3.5)
      },
    ),
    { name: "UIStore", enabled: process.env.NODE_ENV === "development" },
  ),
);
