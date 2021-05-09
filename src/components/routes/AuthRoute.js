import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import ProgRoute from "./ProgRoute";

function AuthRoute({ loggedUser, component: Component, ...rest }) {
  return (
    <ProgRoute
      {...rest}
      render={props => {
        return loggedUser ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></ProgRoute>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};
export default connect(mapStateToProps, null)(AuthRoute);
