import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./PostItem";
import { fetchSinglePost } from "../../redux/actions/postActions";
import { connect } from "react-redux";
import { Grid, Paper, makeStyles } from "@material-ui/core";
import Comments from "../comments/Comments";
import PostSkeleton from "./PostSkeleton";
import CommentsSkeleton from "../comments/CommentsSkeleton";
import { useTitle } from "../../helpers";
import { useAppTheme } from "../../contexts/AppThemeContext";

function PostSingle(props) {
  useTitle();
  // material ui stuff
  const { darkMode } = useAppTheme();
  const useStyles = makeStyles(theme => ({
    borderRight: {
      [theme.breakpoints.up("md")]: {
        paddingRight: "50px",
        borderRight: darkMode ? "#5c5f63 solid 1px" : "#E0E0E0 solid 2px",
      },
    },
  }));
  const classes = useStyles();
  // my stuff
  const { fetchSinglePost, singlePost, loading, history } = props;

  const { id } = useParams();

  useEffect(() => {
    let unsub;

    fetchSinglePost(id, history)
      .then(unsubscribe => {
        unsub = unsubscribe;
      })
      .catch(unsubscribe => {
        unsub = unsubscribe;
      });
    return () => {
      if (typeof unsub === "function") {
        unsub();
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "22px", width: "93%", margin: "auto " }}>
      <Grid container spacing={5}>
        {loading ? (
          <>
            <Grid item xs={12} sm={12} md={6} className={classes.borderRight}>
              <PostSkeleton />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CommentsSkeleton />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={12} md={singlePost.image ? 6 : 12} className={classes.borderRight}>
              <PostItem post={singlePost} />
            </Grid>
            <Grid item xs={12} sm={12} md={singlePost.image ? 6 : 12}>
              <Comments comments={singlePost.comments} notificationReceiverId={singlePost.user.uid} />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}
const mapStateToProps = state => {
  return {
    loading: state.uiReducer.loading.PostSingle,
    singlePost: state.postReducer.singlePost,
  };
};

export default connect(mapStateToProps, { fetchSinglePost })(PostSingle);
