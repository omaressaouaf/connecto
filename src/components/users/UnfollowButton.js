import { Button, Icon } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { unfollow } from "../../redux/actions/userActions";

function UnfollowButton({ loggedUser, user, unfollow, loading }) {
  const handleUnfollow = async () => {
    await unfollow(loggedUser, user);
  };

  return (
    <Button
      onClick={handleUnfollow}
      disabled={loading}
      startIcon={loading ? <Icon className="fa fa-spinner fa-spin" /> : <Icon className="fa fa-check" />}
      variant="contained"
      color="default"
      size="small"
      className="lowerCaseButton"
    >
      Following
    </Button>
  );
}
const mapStateToProps = (state, ownProps) => {
  return {
    loggedUser: state.authReducer.loggedUser,
    loading: state.uiReducer.loading[`UnfollowButton${ownProps.user.id}`],
  };
};

export default connect(mapStateToProps, { unfollow })(UnfollowButton);
