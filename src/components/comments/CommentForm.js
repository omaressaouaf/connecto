import { FormControl, TextField, makeStyles, Box, Button, Icon } from "@material-ui/core";
import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { fireToast } from "../../helpers";
import { addComment } from "../../redux/actions/postActions";
import { sendNotification } from "../../redux/actions/notificationActions";

const useStyles = makeStyles({
  form: {
    // marginLeft: "20px",
    marginBottom: "5px",
  },
  title: {
    textAlign: "center",
    fontWeight: "300",
  },
});
function CommentForm(props) {
  // material ui stuff
  const classes = useStyles();

  // my stuff
  const { loggedUser, loading, singlePost, addComment, sendNotification, notificationReceiverId } = props;

  const inputRef = useRef("");
  const [body, setBody] = useState("");

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (body.trim() === "") {
      fireToast("error", "Enter a comment Please !");
      return;
    }
    const newComment = {
      body,
      createdAt: Date.now(),
      user: {
        uid: loggedUser.uid,
        name: loggedUser.collData.name,
        avatar: loggedUser.collData.avatar,
      },
      postId: singlePost.id,
    };
    addComment(newComment).then(() => {
      setBody("");
      sendNotification(notificationReceiverId, `/posts/${singlePost.id}`, "Commented on your post", "fa fa-comments", "#36BD57");
    });
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <h1 className={classes.title}>Comments Section</h1>
      <FormControl fullWidth>
        <TextField value={body} onChange={e => setBody(e.target.value)} inputRef={inputRef} variant="outlined" placeholder="Leave a comment ..." multiline rows={2} />
      </FormControl>
      <Box mt={2} />
      <Button startIcon={loading ? <Icon className="fa fa-circle-o-notch fa-spin" /> : <Icon className="fa fa-send" />} disabled={loading} type="submit" fullWidth color="primary" variant="contained">
        Submit
      </Button>
    </form>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    loading: state.uiReducer.loading.CommentForm,
    singlePost: state.postReducer.singlePost,
  };
};

export default connect(mapStateToProps, { addComment, sendNotification })(CommentForm);
