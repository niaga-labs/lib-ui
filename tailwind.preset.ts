import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
    darkMode: ["class"],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--ui-background))",
                foreground: "hsl(var(--ui-foreground))",
                card: {
                    DEFAULT: "hsl(var(--ui-card))",
                    foreground: "hsl(var(--ui-card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--ui-popover))",
                    foreground: "hsl(var(--ui-popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--ui-primary))",
                    foreground: "hsl(var(--ui-primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--ui-secondary))",
                    foreground: "hsl(var(--ui-secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--ui-muted))",
                    foreground: "hsl(var(--ui-muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--ui-accent))",
                    foreground: "hsl(var(--ui-accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--ui-destructive))",
                    foreground: "hsl(var(--ui-destructive-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--ui-success))",
                    foreground: "hsl(var(--ui-success-foreground))",
                },
                warning: {
                    DEFAULT: "hsl(var(--ui-warning))",
                    foreground: "hsl(var(--ui-warning-foreground))",
                },
                border: "hsl(var(--ui-border))",
                input: "hsl(var(--ui-input))",
                ring: "hsl(var(--ui-ring))",
                chart: {
                    "1": "hsl(var(--ui-chart-1))",
                    "2": "hsl(var(--ui-chart-2))",
                    "3": "hsl(var(--ui-chart-3))",
                    "4": "hsl(var(--ui-chart-4))",
                    "5": "hsl(var(--ui-chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--ui-radius)",
                md: "calc(var(--ui-radius) - 2px)",
                sm: "calc(var(--ui-radius) - 4px)",
            },
            aspectRatio: {
                "3/4": "3 / 4",
                "4/5": "4 / 5",
                "16/9": "16 / 9",
                "21/9": "21 / 9",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default preset;
