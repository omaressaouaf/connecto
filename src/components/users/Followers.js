import { Box, Typography, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserFollowers } from "../../redux/actions/userActions";
import UsersList from "./UsersList";
import UsersListSkeleton from "./UsersListSkeleton";

const useStyles = makeStyles({
  widget: {
    maxWidth: "630px",
    margin: "auto",
  },
  title: {
    marginLeft: "10px",
    color: "#4f4847",
    textAlign: "center",
    fontSize: "50px",
  },
});

function Followers({ loggedUser, fetchUserFollowers, followers, loading }) {
  // material ui stuff
  const classes = useStyles();

  // my stuff
  const { userId } = useParams();
  useEffect(() => {
    fetchUserFollowers(userId, loggedUser);
    // eslint-disable-next-line
  }, [userId]);
  return (
    <div className={classes.widget}>
      <Box mt={0} mb={2}>
        <Typography variant="subtitle2" className={classes.title}>
          Followers
        </Typography>
      </Box>
      {loading ? <UsersListSkeleton /> : <UsersList users={followers} usersType="Followers" />}
    </div>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    followers: state.userReducer.users,
    loading: state.uiReducer.loading.Followers,
  };
};
export default connect(mapStateToProps, { fetchUserFollowers })(Followers);
