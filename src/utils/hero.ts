import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        //@ts-expect-error this is a custom color name
        "secondary-background": "#F4F4F5",
      },
    },
    dark: {
      colors: {
        background: "#080101",
        //@ts-expect-error this is a custom color name
        "secondary-background": "#1b1818",
      },
    },
  },
});
