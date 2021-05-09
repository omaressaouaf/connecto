import React from "react";
import { Switch } from "@material-ui/core";
import { useAppTheme } from "../../contexts/AppThemeContext";

export default function ThemeSwitch() {
  const { darkMode, toggleDarkMode } = useAppTheme();
  return <Switch checked={darkMode} onChange={toggleDarkMode} color="primary" name="checkedB" inputProps={{ "aria-label": "primary checkbox" }} />;
}
