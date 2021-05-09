import React from "react";
import { Avatar, Box, Button, Fab, Grid, Icon, makeStyles } from "@material-ui/core";
import ProgressBar from "../../components/shared/ProgressBar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateAvatar, cancelUploadFile } from "../../redux/actions/authActions";
import FollowButton from "./FollowButton";
import UnfollowButton from "./UnfollowButton";
import { fileIsValid, fireSwal } from "../../helpers";

const useStyles = makeStyles(theme => ({
  userAvatarGrid: {
    position: "relative",
  },
  userAvatar: {
    width: "230px",
    height: "230px",
    margin: "auto",
    position: "relative",
  },
  userAvatarEditButton: {
    position: "absolute",
    top: 160,
    left: "65%",
  },
}));

function ProfileHeader({ loggedUser, singleUser, updateAvatar, cancelUploadFile, progress }) {
  // material ui stuff
  const classes = useStyles();

  // ___________________________________________________________________________________________________

  // my stuff

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!fileIsValid(selectedFile)) {
        fireSwal("error", "File must be an image and it's size must be less than 2 MB");
        return;
      }
      updateAvatar(selectedFile);
      e.target.value = "";
    }
  }

  return (
    <Grid container className="root">
      <Grid item xs={12} sm={12} md={4} className={classes.userAvatarGrid}>
        <Avatar className={classes.userAvatar} alt="Cindy Baker" src={loggedUser.uid === singleUser.id ? loggedUser.collData.avatar : singleUser.avatar} />

        {loggedUser.uid === singleUser.id && (
          <>
            <Fab size="medium" color="secondary" aria-label="edit" className={classes.userAvatarEditButton}>
              <label htmlFor="file-avatar">
                <Icon className="fa fa-pencil" style={{ marginTop: "8px ", cursor: "pointer" }} />
              </label>
            </Fab>

            <input onChange={handleFileChange} id="file-avatar" style={{ display: "none" }} type="file" />
            {progress !== undefined && (
              <Box my={3} px={6}>
                <ProgressBar progress={progress} cancelUploadFile={cancelUploadFile} />
              </Box>
            )}
          </>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Box display="flex" alignItems="center">
          <h1 className="lead" style={{ marginRight: "43px" }}>
            {singleUser.name}
          </h1>
          {loggedUser.uid === singleUser.id ? (
            <Button startIcon={<Icon className="fa fa-cog" />} component={Link} to="/profile/settings" size="medium" variant="contained" color="primary">
              Settings
            </Button>
          ) : singleUser.followedByLoggedUser ? (
            <UnfollowButton user={singleUser} />
          ) : (
            <FollowButton user={singleUser} />
          )}
        </Box>
        <Box display="flex" alignItems="center">
          {loggedUser.uid === singleUser.id ? (
            <>
              <h3 className="lead" style={{ marginRight: "43px" }}>
                <b>{loggedUser.collData.postCount}</b> posts
              </h3>
              <h3 className="lead" style={{ marginRight: "43px" }}>
                <b>{loggedUser.collData.followerCount}</b> followers
              </h3>
              <h3 className="lead" style={{ marginRight: "43px" }}>
                <b>{loggedUser.collData.followingCount}</b> followings
              </h3>
            </>
          ) : (
            <>
              <h3 className="lead" style={{ marginRight: "43px" }}>
                <b>{singleUser.postCount}</b> posts
              </h3>
              <h3 className="lead" style={{ marginRight: "43px" }}>
                <b>{singleUser.followerCount}</b> followers
              </h3>
              <h3 className="lead" style={{ marginRight: "43px" }}>
                <b>{singleUser.followingCount}</b> followings
              </h3>
            </>
          )}
        </Box>
        <Box mb={4}>
          <h2 className="lead">About me </h2>
          <p>{singleUser.bio}</p>
        </Box>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    progress: state.uiReducer.progress.ProfileHeader,
  };
};

export default connect(mapStateToProps, { updateAvatar, cancelUploadFile })(ProfileHeader);
