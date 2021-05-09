import { Box, Typography, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import UsersList from "./UsersList";
import { fetchUserFollowings } from "../../redux/actions/userActions";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
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

function Followings({ loggedUser, fetchUserFollowings, followings, loading }) {
  // material ui stuff
  const classes = useStyles();

  // my stuff
  const { userId } = useParams();

  useEffect(() => {
    fetchUserFollowings(userId, loggedUser);
    // eslint-disable-next-line
  }, [userId]);
  return (
    <div className={classes.widget}>
      <Box mt={0} mb={2}>
        <Typography variant="subtitle2" className={classes.title}>
          Followings
        </Typography>
      </Box>
      {loading ? <UsersListSkeleton /> : <UsersList users={followings} usersType="Followings" />}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    followings: state.userReducer.users,
    loading: state.uiReducer.loading.Followings,
  };
};
export default connect(mapStateToProps, { fetchUserFollowings })(Followings);
