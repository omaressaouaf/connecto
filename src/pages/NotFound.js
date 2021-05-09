import React from "react";
import NotFoundImage from "../images/404.svg";
import { useTitle } from "../helpers";

export default function NotFound() {
  useTitle("Not Found");
  return (
    <div style={{ textAlign: "center" }}>
      <h1 className="lead" style={{ fontSize: 50 }}>
        Resource Not found
      </h1>
      <img style={{ width: "50%" }} src={NotFoundImage} alt="" />
    </div>
  );
}
