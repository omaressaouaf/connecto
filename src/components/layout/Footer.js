import React from "react";
import { useAppTheme } from "../../contexts/AppThemeContext";

export default function Footer() {
  const { darkMode } = useAppTheme();
  return (
    <div className="footer" style={darkMode  ?  { backgroundColor: "#242526" } : null}>
      <h3 className="lead">
        <i className="fa fa-copyright"></i> ConnecTo By Omar Essaouaf
      </h3>
    </div>
  );
}
