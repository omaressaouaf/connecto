import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, makeStyles, ListItemSecondaryAction, IconButton, Icon, Divider } from "@material-ui/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fireSwalConfirm } from "../../helpers";
import { deleteComment } from "../../redux/actions/postActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useAppTheme } from "../../contexts/AppThemeContext";

const useStyles = makeStyles(theme => ({
  commentUser: {
    fontWeight: "bold",
    fontSize: "14px",

    "&:hover": {
      textDecoration: "underline",
      color: "blue",
    },
  },
  commentUserAvatar: {
    marginTop: "4px",
  },
  commentDate: {
    color: "grey",
    marginLeft: "10px",
  },
  commentBody: {
    maxWidth: "90%",
    color: "black",
    wordWrap: "break-word",
    display: "block",
  },
  link: {
    textDecoration: "none",
    color: "black",
    "&:hover": {
      textDecoration: "underline",
      color: "blue",
    },
  },
}));
function CommentItem(props) {
  // material ui stuff
  const { darkMode } = useAppTheme();
  const classes = useStyles();

  // my stuff
  const { loggedUser, comment, deleteComment, shouldCommentBeDisabled } = props;

  dayjs.extend(relativeTime);

  const handleDelete = id => {
    fireSwalConfirm(() => deleteComment(id));
  };
  const commentUserAndDate = (
    <>
      <Link className={classes.link} to={`/users/${comment.user.uid}`}>
        <Typography className={classes.commentUser} component="span" variant="overline" color="textPrimary">
          {comment.user.name}
        </Typography>
      </Link>

      <Typography className={classes.commentDate} component="span" variant="subtitle2" color="textPrimary">
        {dayjs(comment.createdAt).fromNow()}
      </Typography>
    </>
  );

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar className={classes.commentUserAvatar} alt="Remy Sharp" src={comment.user.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={commentUserAndDate}
          secondary={
            <>
              <span className={classes.commentBody} style={darkMode ? { color: "white" } : null}>
                {comment.body}
              </span>
            </>
          }
        />

        <ListItemSecondaryAction>
          {comment.user.uid === loggedUser.uid && (
            <IconButton disabled={shouldCommentBeDisabled} onClick={() => handleDelete(comment.id)} color="secondary" edge="end" aria-label="comments">
              <Icon className="fa fa-trash" />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};
export default connect(mapStateToProps, { deleteComment })(CommentItem);
