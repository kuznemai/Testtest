import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  ignores: [".nuxt/**", ".output/**", "node_modules/**", "playwright-report/**", "test-results/**"],
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
});
