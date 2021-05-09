import { Avatar, Box, Typography, Button, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UsersList from "./UsersList";
import { fetchSuggestions } from "../../redux/actions/userActions";
import { connect } from "react-redux";
import UsersListSkeleton from "./UsersListSkeleton";
import { useAppTheme } from "../../contexts/AppThemeContext";

function FollowSuggestions({ loggedUser, fetchSuggestions, suggestions, loading }) {
  // material ui stuff
  const { darkMode } = useAppTheme();
  const useStyles = makeStyles({
    wideWidget: {
      margin: "auto",
      width: "50%",
      position: "static !important",
    },
    widget: {
      position: "fixed",
      minWidth: "330px",
      // maxHeight: "550px",
      // overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "22px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#bec4c1",
        border: "4px solid transparent",
        borderRadius: " 8px",
        backgroundClip: "padding-box",
      },
      // backgroundColor: "red",
      paddingRight: "10px",
    },
    avatar: {
      width: "60px",
      height: "60px",
    },
    title: {
      marginLeft: "10px",
      color: darkMode ? "white" : "#4f4847",
    },
    link: {
      textTransform: "none",
      fontWeight: "600",
      padding: "5px 15px",
      borderRadius: "40px",
      transition: "all 0.2s",
      "&:hover": {
        padding: "5px 28px",
      },
    },
  });
  const classes = useStyles();

  // ________________________________________________________________________________________________________
  // my stuff
  const { pathname } = useLocation();

  useEffect(() => {
    fetchSuggestions(loggedUser, pathname);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`${classes.widget} ${pathname === "/users" && classes.wideWidget}`}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={0.1}>
          <Avatar className={classes.avatar} alt="Cindy Baker" src={loggedUser.collData.avatar} />
        </Box>

        <Box flexGrow={0.4}>
          <Typography variant="overline">{loggedUser.collData.name}</Typography>
          <br />
          <Typography variant="subtitle2">{loggedUser.email}</Typography>
        </Box>
        <Box mt={2} style={{ marginLeft: "auto" }}>
          <Button component={Link} to={"/users/" + loggedUser.uid} color="primary" size="small">
            Profile
          </Button>
        </Box>
      </Box>

      <Box mt={3} mb={2} display="flex" alignItems="center">
        <Box flexGrow={1}>
          <Typography variant="subtitle2" className={classes.title}>
            Suggestions For You
          </Typography>
        </Box>
        {pathname === "/" && (
          <Box mb={1}>
            <Button component={Link} to="users" color="default" className={classes.link} variant="contained" size="small">
              See All
            </Button>
          </Box>
        )}
      </Box>
      {loading ? <UsersListSkeleton /> : <UsersList users={suggestions} usersType="Suggestions" />}
    </div>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    suggestions: state.userReducer.users,
    loading: state.uiReducer.loading.FollowSuggestions,
  };
};
export default connect(mapStateToProps, { fetchSuggestions })(FollowSuggestions);
