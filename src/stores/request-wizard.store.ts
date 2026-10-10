import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { Priority } from "@/types";

export const WIZARD_STEPS = [
  { key: "site", title: "Site" },
  { key: "service", title: "Service" },
  { key: "details", title: "Details" },
  { key: "review", title: "Review" },
] as const;

export interface RequestDraft {
  siteId: string;
  categoryId: string;
  title: string;
  description: string;
  priority: Priority;
  preferredAt: string;
}

const EMPTY_DRAFT: RequestDraft = {
  siteId: "",
  categoryId: "",
  title: "",
  description: "",
  priority: "NORMAL",
  preferredAt: "",
};

const LAST_STEP = WIZARD_STEPS.length - 1;

interface RequestWizardState {
  step: number;
  draft: RequestDraft;
  hasHydrated: boolean;

  updateDraft: (values: Partial<RequestDraft>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useRequestWizardStore = create<RequestWizardState>()(
  devtools(
    persist(
      (set) => ({
        step: 0,
        draft: EMPTY_DRAFT,
        hasHydrated: false,

        updateDraft: (values) =>
          set(
            (state) => ({ draft: { ...state.draft, ...values } }),
            undefined,
            "wizard/updateDraft",
          ),

        nextStep: () =>
          set(
            (state) => ({ step: Math.min(state.step + 1, LAST_STEP) }),
            undefined,
            "wizard/nextStep",
          ),

        prevStep: () =>
          set(
            (state) => ({ step: Math.max(state.step - 1, 0) }),
            undefined,
            "wizard/prevStep",
          ),

        goToStep: (step) =>
          set(
            { step: Math.min(Math.max(step, 0), LAST_STEP) },
            undefined,
            "wizard/goToStep",
          ),

        reset: () =>
          set({ step: 0, draft: EMPTY_DRAFT }, undefined, "wizard/reset"),

        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: "fieldops-request-draft",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ step: state.step, draft: state.draft }),
        skipHydration: true,
        onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      },
    ),
    {
      name: "RequestWizardStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
