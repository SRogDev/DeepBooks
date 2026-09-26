/**
 * Feature flags — control which product areas are active.
 *
 * Social was removed from the MVP (kept in git history) and lives behind
 * FEATURE_SOCIAL for a post-MVP reintroduction. Everything else stays on.
 */
export const FEATURE_SOCIAL =
  process.env.NEXT_PUBLIC_FEATURE_SOCIAL === "true";

export const FEATURE_MARKETPLACE =
  process.env.NEXT_PUBLIC_FEATURE_MARKETPLACE !== "false";

export const FEATURE_AMBIENT =
  process.env.NEXT_PUBLIC_FEATURE_AMBIENT !== "false";
