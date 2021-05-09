import React from "react";
import { Avatar, Box, Typography, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import UnfollowButton from "./UnfollowButton";
import FollowButton from "./FollowButton";
import { connect } from "react-redux";

const useStyles = makeStyles({
  extraInfo: {
    color: "grey",
  },

  avatar: {
    marginLeft: "10px",
    width: "40px",
    height: "40px",
  },
  name: {
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      textDecoration: "underline",
      color: "blue",
    },
  },
  copyright: { color: "grey", margin: " 20px 14px " },
});

function UsersList({ loggedUser, users, usersType }) {
  // material ui stuff
  const classes = useStyles();
  // my stuff

  return (
    <>
      {!users.length ? (
        <Alert severity="warning" variant="standard" >No {usersType} for now</Alert>
      ) : (
        users.map(user => {
          return (
            <Box key={user.id} mb={3} display="flex" alignItems="center">

              <Box flexGrow={0.1} mr={1}>
                <Link to={"/users/" + user.id}>
                  <Avatar className={classes.avatar} alt="Cindy Baker" src={user.avatar} />
                </Link>
              </Box>

              <Box flexGrow={0.4} mr={2}>
                <Link className={classes.name} to={"/users/" + user.id}>
                  <Typography variant="overline">{user.name}</Typography>
                </Link>
                <br />
                <Typography variant="subtitle2" className={classes.extraInfo}>
                  Joined On {dayjs(user.createdAt).format("MMM D, YYYY")}
                </Typography>
              </Box>

              <Box mt={2} style={{ marginLeft: "auto" }}>
                {user.id !== loggedUser.uid ? user.followedByLoggedUser ? <UnfollowButton user={user} /> : <FollowButton user={user} /> : null}
              </Box>
            </Box>
          );
        })
      )}

      <Box>
        <Typography className={classes.copyright}>© 2020 ConnecTo by Omar Essaouaf</Typography>
      </Box>
    </>
  );
}

const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};
export default connect(mapStateToProps, null)(UsersList);
