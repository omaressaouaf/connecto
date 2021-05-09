import { Avatar, Card, CardContent, Container, Grid, Typography, makeStyles, CardActions, Box, Divider, Button , fade } from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import UnfollowButton from "./UnfollowButton";
import { connect } from "react-redux";
import { useAppTheme } from "../../contexts/AppThemeContext";


function SearchedUserItem({ user, loggedUser }) {
  // material ui stuff
  const { darkMode } = useAppTheme();

  const useStyles = makeStyles(theme => ({
    card: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    container: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      padding: "23px 23px 0px 23px",
    },
    avatar: {
      width: "70px",
      height: "70px",
    },
    name: {
      marginBottom: "0px",
    },
    link: { textDecoration: "none", color: "inherit" },
    date: { marginTop: "10px", color: "green" },
    footer: {
      backgroundColor: darkMode ? fade(theme.palette.common.white, 0.15) :"#F6F6FF",
      padding: "15px",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
    action: {},
  }));
  const classes = useStyles();

  return (
    <Grid xs={12} sm={12} md={4} lg={4} item>
      <Card className={classes.card}>
        <Container className={classes.container}>
          <Avatar component={Link} to={"/users/" + user.id} alt="Profile Image" src={user.avatar} className={classes.avatar} />
          <Typography component={Link} to={"/users/" + user.id} className={classes.link}>
            <h3 className={`${classes.name} lead`}>{user.name}</h3>
          </Typography>

          <h5 className={`${classes.date} lead`}>Joined On {dayjs(user.createdAt).format("MMM D, YYYY")}</h5>
          {user.id === loggedUser.uid ? (
            <Button variant="contained" color="secondary" component={Link} to={"/users/" + user.id}>
              Profile
            </Button>
          ) : user.followedByLoggedUser ? (
            <UnfollowButton user={user} />
          ) : (
            <FollowButton user={user} />
          )}
        </Container>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {user.bio}
          </Typography>
        </CardContent>
        <CardActions className={classes.footer}>
          <Box>
            <Typography variant="body2" color="textSecondary" component="p">
              {user.followerCount} Followers
            </Typography>
          </Box>
          <Divider orientation="vertical" style={{ height: "50px" }} />
          <Box>
            <Typography variant="body2" color="textSecondary" component="p">
              {user.followingCount} Followings
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};
export default connect(mapStateToProps, null)(SearchedUserItem);
