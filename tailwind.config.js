/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                search: "300px 1fr",
            },
        },
    },
    plugins: [],
};
