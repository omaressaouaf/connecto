import { Button, Icon } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { sendNotification } from "../../redux/actions/notificationActions";
import { follow } from "../../redux/actions/userActions";

function FollowButton({ loggedUser, user, follow, loading, sendNotification }) {
  const handleFollow = async () => {
    await follow(loggedUser, user);
    sendNotification(user.id, `/users/${loggedUser.uid}`, "Followed you", "fa fa-user-plus", "#0C6FDB");
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      startIcon={loading ? <Icon className="fa fa-spinner fa-spin" /> : <Icon className="fa fa-plus" />}
      variant="contained"
      color="primary"
      size="small"
      className="lowerCaseButton"
    >
      Follow
    </Button>
  );
}
const mapStateToProps = (state, ownProps) => {
  return {
    loggedUser: state.authReducer.loggedUser,
    loading: state.uiReducer.loading[`FollowButton${ownProps.user.id}`],
  };
};

export default connect(mapStateToProps, { follow, sendNotification })(FollowButton);
