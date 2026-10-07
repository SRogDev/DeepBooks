import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...nextCoreWebVitals, ...nextTypescript],

    rules: {
        "prefer-const": "error",
        "no-unused-vars": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "react-hooks/exhaustive-deps": "warn",
        // Next 16 upgrade (2026-09-27): the new eslint-config-next flat config
        // enables stricter rules than the repo ever enforced (previously
        // `next lint` was never part of the verified checks). These patterns
        // are pre-existing product code; keep them as warnings so the upgrade
        // stays chore-only. Future cleanup can address them deliberately.
        "react-hooks/set-state-in-effect": "warn",
        "react-hooks/purity": "warn", // Math.random in vendored shadcn sidebar — pre-existing
        "react/no-unescaped-entities": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-require-imports": "warn",
        "react-hooks/rules-of-hooks": "warn", // flags useAmbientTrigger in book-reader.tsx — pre-existing, needs deliberate fix
    },
}]);