// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
    plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
    overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
    trailingComma: "es5",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    svelteIndentScriptAndStyle: false,
};

export default config;
