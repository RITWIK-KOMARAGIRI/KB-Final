import React, { createContext, useEffect, useState } from "react";

/**
 * ThemeContext
 * - Provides `theme` ("light" | "dark") and `toggleTheme()` to the app.
 * - Persists choice to localStorage.
 * - Toggles `dark` class on document.documentElement so Tailwind `dark:` utilities work.
 */
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Initialize from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    // This line is key: it adds/removes the 'dark' class to the <html> tag
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    // This line updates the 'dark' class on toggle
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};