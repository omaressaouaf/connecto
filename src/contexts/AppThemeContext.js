import { createContext, useContext, useState } from "react";

const AppThemeContext = createContext();
export const useAppTheme = () => {
  return useContext(AppThemeContext);
};

export const AppThemeProvider = props => {
  const saveToLG = darkMode => {
    try {
      localStorage.setItem("darkMode", darkMode);
    } catch (err) {}
  };
  const getFromLG = () => {
    try {
      const darkMode = localStorage.getItem("darkMode");
      return darkMode === null ? false : darkMode;
    } catch (err) {
      return false;
    }
  };
  const [darkMode, setDarkMode] = useState(getFromLG());

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => {
      saveToLG(!prevDarkMode);
      return !prevDarkMode;
    });
  };
  const value = {
    darkMode,
    toggleDarkMode,
  };
  return <AppThemeContext.Provider value={value}> {props.children} </AppThemeContext.Provider>;
};
