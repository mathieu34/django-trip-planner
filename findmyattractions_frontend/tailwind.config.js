/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                wanderlust: {
                    ocean: "var(--color-ocean)",
                    sky: "var(--color-sky)",
                    sunset: "var(--color-sunset)",
                    sand: "var(--color-sand)",
                    forest: "var(--color-forest)",
                    night: "var(--color-night)",
                    cream: "var(--color-cream)",
                },
                primary: {
                    DEFAULT: "var(--color-primary)",
                    dark: "var(--color-primary-dark)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                }
            },
            fontFamily: {
                sans: [
                    "Inter",
                    "ui-sans-serif",
                    "system-ui"
                ],
                display: [
                    "Poppins",
                    "sans-serif"
                ]
            },
            borderRadius: {
                wander: "1.5rem",
            },
            boxShadow: {
                travel: "0 15px 40px rgba(0,0,0,.12)",
                card: "0 10px 30px rgba(0,0,0,.08)",
            },
            backgroundImage: {
                "hero-gradient": "linear-gradient(135deg,var(--color-ocean),var(--color-sunset))",
                "sunset-gradient": "linear-gradient(120deg,#ff9966,#ff5e62)"
            }
        }
    },
    plugins: [],
}