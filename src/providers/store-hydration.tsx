"use client";

import { useEffect } from "react";
import { useRequestWizardStore, useUIStore } from "@/stores";

export default function StoreHydration() {
  useEffect(() => {
    void useUIStore.persist.rehydrate();
    void useRequestWizardStore.persist.rehydrate();
  }, []);

  return null;
}
