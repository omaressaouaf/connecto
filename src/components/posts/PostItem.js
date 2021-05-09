import { Grid, IconButton, Icon, Avatar, Typography, Box, Button, Chip, Divider, makeStyles, Tooltip } from "@material-ui/core";
import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostOptions from "./PostOptions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toggleLike } from "../../redux/actions/postActions";
import Skeleton from "@material-ui/lab/Skeleton";
import { sendNotification } from "../../redux/actions/notificationActions";

const useStyles = makeStyles(theme => ({
  timestamp: {
    color: "grey",
  },
  postImage: {
    width: "100%",
  },
  chip: {
    margin: "auto 10px",
  },
  avatar: {
    paddingRight: 0,
    paddingLeft: 0,
    marginLeft: 10,
  },
  postUserName: {
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      textDecoration: "underline",
      color: "blue",
    },
  },
}));
function PostItem(props) {
  // material ui stuff
  const classes = useStyles();

  // my stuff
  dayjs.extend(relativeTime);
  const { loggedUser, post, toggleLike, sendNotification } = props;
  const likeButtonRef = useRef("");
  const likeIconRef = useRef("");
  const [imageLoading, setImageLoading] = useState(true);

  const handleToggleLike = async () => {
    toggleLike(post, loggedUser.uid).then(operation => {
      if (operation === "like") {
        sendNotification(post.user.uid, `/posts/${post.id}`, "Liked your Post", "fa fa-heart", "#F50057");
      }
    });
  };

  const likeButton = post.likedByLoggedUser ? (
    <Tooltip placement="bottom" title={<h3>You have already liked this Post</h3>}>
      <Button ref={likeButtonRef} onClick={handleToggleLike} color="secondary" fullWidth startIcon={<Icon className="fa fa-heart" ref={likeIconRef} />}>
        Like
      </Button>
    </Tooltip>
  ) : (
    <Tooltip placement="bottom" title={<h3>Like this Post</h3>}>
      <Button ref={likeButtonRef} onClick={handleToggleLike} color="secondary" fullWidth startIcon={<Icon className="fa fa-heart-o" ref={likeIconRef} />}>
        Like
      </Button>
    </Tooltip>
  );

  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box>
          <IconButton className={classes.avatar} component={Link} to={"/users/" + post.user.uid}>
            <Avatar alt="Cindy Baker" src={post.user.avatar} />
          </IconButton>
        </Box>
        <Box flexGrow={1}>
          <Box mt={1} ml={1}>
            <Link className={classes.postUserName} to={"/users/" + post.user.uid}>
              <Typography variant="overline">{post.user.name}</Typography>
            </Link>
            <Typography variant="subtitle2" className={classes.timestamp}>
              {dayjs(post.createdAt).fromNow()}
            </Typography>
          </Box>
        </Box>

        <Box>
          <PostOptions post={post} />
        </Box>
      </Box>

      <Grid container>
        <Grid item sm={12} xs={12} md={12} lg={12}>
          <Box px={2}>
            <p>{post.body}</p>
          </Box>
        </Grid>
      </Grid>
      {post.image && (
        <Grid container>
          <Grid item sm={12} xs={12} md={12} lg={12}>
            <Box px={0}>
              {imageLoading && <Skeleton component="div" animation="wave" variant="rect" width="100%" style={{ height: 290, width: "100%" }} />}
              <img onLoad={() => setImageLoading(false)} className={classes.postImage} src={post.image} alt="Post" />
            </Box>
          </Grid>
        </Grid>
      )}

      <Box mt={1} />

      <Grid container>
        <Grid item sm={12} xs={12} md={12} lg={12}>
          <Chip label={post.likeCount + " Likes"} className={classes.chip} icon={<Icon className="fa fa-heart" />} />
          <Chip label={post.commentCount + " Comments"} icon={<Icon className="fa fa-comments-o" />} />
        </Grid>
      </Grid>

      <Box mb={1} mt={2}>
        <Divider variant="fullWidth" />
      </Box>

      <Grid container>
        <Grid item sm={6} xs={6} md={6} lg={6}>
          {likeButton}
        </Grid>

        <Grid item sm={6} xs={6} md={6} lg={6}>
          <Button component={Link} to={"/posts/" + post.id} fullWidth startIcon={<Icon className="fa fa-comment" />}>
            Comment
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};

export default connect(mapStateToProps, { toggleLike, sendNotification })(PostItem);
