import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated directories
    "coverage/**",
    // Independent sub-apps have their own package manifests and lint configs.
    "CHATBOT_WEB_CLIENT/**",
    "DASHBOARD_VII/**",
    "MINDORA_WEB_APP/**",
    "OFFICIAL_WEBSITE/**",
  ]),
]);

export default eslintConfig;
