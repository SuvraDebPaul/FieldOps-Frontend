import type { CategoryParams, SiteParams } from "@/types";

export const WIZARD_SITE_PARAMS: SiteParams = { limit: 100 };
export const WIZARD_CATEGORY_PARAMS: CategoryParams = { limit: 100 };

export const STEP_HINTS = [
  "Choose the site where the technician should go.",
  "Pick the type of service you need.",
  "Describe the problem so the right technician comes prepared.",
  "Check everything, then submit your request.",
];

// Which step to send the user back to when a field is invalid
export const STEP_OF_FIELD: Record<string, number> = {
  siteId: 0,
  categoryId: 1,
};
