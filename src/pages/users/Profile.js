import { Grid } from "@material-ui/core";

import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ProfileDial from "../../components/users/ProfileDial";
import ProfileTabs from "../../components/users/ProfileTabs";
import { connect } from "react-redux";
import { fetchSingleUser } from "../../redux/actions/userActions";
import ProfileHeader from "../../components/users/ProfileHeader";
import ProfileHeaderSkeleton from "../../components/users/ProfileHeaderSkeleton";
import { useTitle } from "../../helpers";

function Profile({ loggedUser, fetchSingleUser, singleUser, loading }) {
  // my stuff
  useTitle("Profile");
  const { userId } = useParams();
  const history = useHistory();

  useEffect(() => {
    fetchSingleUser(userId, loggedUser, history);
    // eslint-disable-next-line
  }, [userId, history]);

  return (
    <>
      {loading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <>
          <ProfileHeader singleUser={singleUser} />
          {loggedUser.uid === singleUser.id && <ProfileDial />}
        </>
      )}

      {/* profile tabs (posts , followers , followings) */}
      <Grid container>
        <Grid item md={12} sm={12} xs={12} lg={12}>
          <ProfileTabs />
        </Grid>
      </Grid>
    </>
  );
}

const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    singleUser: state.userReducer.singleUser,
    loading: state.uiReducer.loading.Profile,
  };
};
export default connect(mapStateToProps, { fetchSingleUser })(Profile);
