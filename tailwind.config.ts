import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        "surface-elevated": "hsl(var(--surface-elevated))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        "player-1": {
          DEFAULT: "hsl(var(--player-1))",
          glow: "hsl(var(--player-1-glow))",
          dark: "hsl(var(--player-1-dark))",
        },
        "player-2": {
          DEFAULT: "hsl(var(--player-2))",
          glow: "hsl(var(--player-2-glow))",
          dark: "hsl(var(--player-2-dark))",
        },
        "surface-glass": "hsl(var(--surface-glass))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          border: "hsl(var(--card-border))",
        },
        "wooden": {
          primary: "hsl(var(--wooden-primary))",
          secondary: "hsl(var(--wooden-secondary))", 
          accent: "hsl(var(--wooden-accent))",
          surface: "hsl(var(--wooden-surface))",
          border: "hsl(var(--wooden-border))",
        },
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)", 
        "gradient-player-1": "var(--gradient-player-1)",
        "gradient-player-2": "var(--gradient-player-2)",
        "gradient-board": "var(--gradient-board)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-glass": "var(--gradient-glass)",
        "gradient-neon": "var(--gradient-neon)",
        "gradient-wooden": "var(--gradient-wooden)",
        "gradient-nebula": "var(--gradient-nebula)",
        "gradient-circular": "var(--gradient-circular)",
      },
      boxShadow: {
        "cone": "var(--shadow-cone)",
        "glow": "var(--shadow-glow)",
        "neon": "var(--shadow-neon)",
        "board": "var(--shadow-board)",
        "glass": "var(--shadow-glass)",
        "wooden": "var(--shadow-wooden)",
        "vibrant": "var(--shadow-vibrant)",
      },
      transitionTimingFunction: {
        "smooth": "var(--transition-smooth)",
        "bounce": "var(--transition-bounce)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.4)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.8)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "neon-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 5px hsl(var(--primary) / 0.5), 0 0 25px hsl(var(--primary) / 0.3)"
          },
          "50%": { 
            boxShadow: "0 0 10px hsl(var(--primary) / 0.8), 0 0 40px hsl(var(--primary) / 0.6)"
          }
        },
        "victory-burst": {
          "0%": { 
            transform: "scale(0.8) rotate(0deg)", 
            opacity: "0",
            filter: "blur(10px)"
          },
          "50%": { 
            transform: "scale(1.1) rotate(180deg)", 
            opacity: "1",
            filter: "blur(0px)"
          },
          "100%": { 
            transform: "scale(1) rotate(360deg)", 
            opacity: "1",
            filter: "blur(0px)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "neon-pulse": "neon-pulse 1.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "victory-burst": "victory-burst 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
