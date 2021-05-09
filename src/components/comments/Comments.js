import { List, makeStyles } from "@material-ui/core";
import React, { forwardRef } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import FlipMove from "react-flip-move";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  list: {
    overflowY: "auto",
    height: "330px",
    "&::-webkit-scrollbar": {
      width: "22px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#bec4c1",
      border: "4px solid transparent",
      borderRadius: " 8px",
      backgroundClip: "padding-box",
    },
  },
}));
function Comments({ comments, notificationReceiverId, loading }) {
  // material ui stuff
  const classes = useStyles();
  // my stuff
  const FlipCommentItem = forwardRef((props, ref) => (
    <div ref={ref}>
      <CommentItem {...props} />
    </div>
  ));

  return (
    <div className={classes.root}>
      <CommentForm notificationReceiverId={notificationReceiverId} />
      <List className={classes.list}>
        <FlipMove>
          {!comments.length ? (
            <Alert severity="warning"> No comments for this post yet</Alert>
          ) : (
            comments.map((comment, index) => {
              return <FlipCommentItem key={comment.id} shouldCommentBeDisabled={index === 0 && loading ? true : false} comment={comment} />;
            })
          )}
        </FlipMove>
      </List>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    loading: state.uiReducer.loading.CommentItem,
  };
};
export default connect(mapStateToProps, null)(Comments);
