import { heroui } from "@heroui/react";

const redColors = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
  950: "#450a0a",
  DEFAULT: "#dc2626",
  foreground: "#ffffff",
};

export default heroui({
  themes: {
    light: {
      colors: {
        //@ts-expect-error this is a custom color name
        "secondary-background": "#F4F4F5",
        danger: redColors,
      },
    },
    dark: {
      colors: {
        background: "#080101",
        //@ts-expect-error this is a custom color name
        "secondary-background": "#1b1818",
        danger: redColors,
      },
    },
  },
});