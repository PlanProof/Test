import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Turn ALL problematic rules to warnings instead of errors
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn", 
      "@typescript-eslint/no-empty-object-type": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "prefer-const": "warn",
      "import/no-anonymous-default-export": "warn"
    },
    ignores: [
      "node_modules/**",
      ".next/**", 
      ".vercel/**",
      "out/**",
      "dist/**"
    ]
  }
];

export default eslintConfig;
