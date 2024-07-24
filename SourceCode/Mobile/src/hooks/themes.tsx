import React, { PropsWithChildren, useContext } from "react";
import { ThemeProvider } from "styled-components/native";
import { isWeb } from "../helpers/utils";
import { darkTheme, lightTheme } from "../themes";
import { useLocalStorage } from "./local-storage";

export type ThemeName = "dark" | "light";

const ThemeManagerContext = React.createContext<{
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}>({ theme: "dark", setTheme: () => {} });

export const ThemeManagerProvider = (props: PropsWithChildren<object>) => {
  const colorScheme = "light";
  const [theme, setTheme] = useLocalStorage<ThemeName>(
    "THEME",
     colorScheme
  );

  return (
    <ThemeManagerContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider
        theme={theme === "dark" ? darkTheme : lightTheme}
        {...props}
      />
    </ThemeManagerContext.Provider>
  );
};
export const useThemeManager = () => useContext(ThemeManagerContext);
