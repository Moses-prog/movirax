"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const DEFAULT_LIGHT_THEME_COLOR = "#FFFFFF";
const DEFAULT_DARK_THEME_COLOR = "#0D0C0F";
const ADMIN_LIGHT_THEME_COLOR = "#FFFFFF";
const ADMIN_DARK_THEME_COLOR = "#111113";

export default function BrowserThemeColor() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isAdmin = pathname.startsWith("/admin");
    const isDark = resolvedTheme === "dark";
    const color = isAdmin
      ? isDark
        ? ADMIN_DARK_THEME_COLOR
        : ADMIN_LIGHT_THEME_COLOR
      : isDark
        ? DEFAULT_DARK_THEME_COLOR
        : DEFAULT_LIGHT_THEME_COLOR;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }

    meta.content = color;
  }, [pathname, resolvedTheme]);

  return null;
}
