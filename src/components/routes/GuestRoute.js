import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import ProgRoute from "./ProgRoute";
function GuestRoute({ loggedUser, component: Component, ...rest }) {

  return (
    <ProgRoute
      {...rest}
      render={props => {
        return loggedUser ? <Redirect to="/" /> : <Component {...props} />;
      }}
    ></ProgRoute>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};
export default connect(mapStateToProps, null)(GuestRoute);
