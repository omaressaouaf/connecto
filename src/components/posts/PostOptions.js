import { IconButton, Menu, MenuItem, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { connect } from "react-redux";
import { deletePost, loadCurrentPost } from "../../redux/actions/postActions";
import PostForm from "./PostForm";
import { fireSwalConfirm } from "../../helpers";
import { Link, useHistory, useLocation } from "react-router-dom";
import ShareDialog from "./ShareDialog";
// import ShareDialog from "./ShareDialog";

const useStyles = makeStyles({
  optionsIcon: {
    marginLeft: "auto",
  },
  icon: {
    marginRight: "5px",
  },
});

function PostOptions(props) {
  // material ui stuff
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOptionsClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleOptionsClose = event => {
    setAnchorEl(null);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => {
      loadCurrentPost(null);
    }, 500);
  };
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const handleShareModalOpen = () => {
    setShareModalOpen(true);
  };
  const handleShareModalClose = () => {
    setShareModalOpen(false);
  };
  // my stuff

  const { loggedUser, post, deletePost, loadCurrentPost, progress } = props;
  const history = useHistory();
  const { pathname } = useLocation();

  const handleEdit = post => {
    loadCurrentPost(post);
    handleModalOpen();
    handleOptionsClose();
  };
  const handleDelete = id => {
    handleOptionsClose();
    fireSwalConfirm(async () => {
      await deletePost(id, history);
    });
  };
  return (
    <>
      <IconButton color="inherit" onClick={handleOptionsClick} className={classes.optionsIcon}>
        <Icon className="fa fa-ellipsis-h" />
      </IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleOptionsClose}>
        {loggedUser.uid === post.user.uid && (
          <div>
            <MenuItem disabled={progress !== undefined} onClick={() => handleEdit(post)}>
              <Icon color="primary" className={`fa fa-pencil ${classes.icon}`} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(post.id)}>
              <Icon color="secondary" className={`fa fa-trash ${classes.icon}`} /> Delete
            </MenuItem>
          </div>
        )}
        <MenuItem onClick={handleShareModalOpen}>
          <Icon color="primary" className={`fa fa-share-square ${classes.icon}`} /> Share
        </MenuItem>
        {pathname !== "/posts/" + post.id && (
          <Link to={"/posts/" + post.id} style={{ textDecoration: "none", color: "inherit" }}>
            <MenuItem>
              <Icon style={{ color: "green" }} className={`fa fa-eye ${classes.icon}`} /> Go to post
            </MenuItem>
          </Link>
        )}
      </Menu>
      <PostForm modalOpen={modalOpen} handleModalClose={handleModalClose} />
      <ShareDialog postId={post.id} modalOpen={shareModalOpen} handleModalClose={handleShareModalClose} />
    </>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    progress: state.uiReducer.progress.PostUploadProgress,
  };
};
export default connect(mapStateToProps, { deletePost, loadCurrentPost })(PostOptions);
