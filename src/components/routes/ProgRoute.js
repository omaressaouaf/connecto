import React from "react";
import { Route } from "react-router-dom";
import nprogress from "nprogress";

export default function ProgRoute(props) {
  React.useEffect(() => {
    nprogress.done();
  });

  nprogress.start();
  return <Route {...props} />;
}
