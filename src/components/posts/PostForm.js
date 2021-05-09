import React, { useState, useEffect, useRef } from "react";
import { Icon, Paper, Box, TextField, IconButton, Button, Avatar, Dialog, DialogTitle, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { addPost, updatePost } from "../../redux/actions/postActions";
import { fileIsValid, fireSwal, fireToast } from "../../helpers";
import { Picker } from "emoji-mart";

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: "center",
  },
  header: {
    display: "flex",
  },

  headerAvatar: {
    padding: "0px 12px 25px 0px",
  },
  headerName: {
    fontSize: "15px",
  },
  inputFile: {
    display: "none",
  },
  imageDiv: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "20px" },
  imageTitle: {
    textAlign: "center",
    fontWeight: "300",
  },
  image: { width: "100%", height: "auto" },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));
function PostForm(props) {
  // material ui stuff
  const classes = useStyles();

  // my stuff

  const { loggedUser, addPost, updatePost, currentPost } = props;
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [formChanged, setFormChanged] = useState(false);
  const [userDeletedOldFile, setUserDeletedOldFile] = useState(false);

  const [pickerVisible, setPickerVisible] = useState(false);

  function initializeStateToDefault() {
    setBody("");
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setFormChanged(false);
    setUserDeletedOldFile(false);
    setPickerVisible(false);
  }
  //  change the value of the body whenever the currentPost changes
  useEffect(() => {
    setBody(currentPost ? currentPost.body : "");
  }, [currentPost]);

  useEffect(() => {
    setPickerVisible(props.pickerVisible);
  }, [props.pickerVisible]);

  // initialize all state to default whenever the modalOpen changes to false (modal closes)
  useEffect(() => {
    if (!props.modalOpen) {
      initializeStateToDefault();
    }
  }, [props.modalOpen]);

  function handleClose() {
    if (formChanged) {
      if (window.confirm("you have unsaved changes . do you really wanna leave ?")) {
        props.handleModalClose();
      }
    } else {
      props.handleModalClose();
    }
  }
  function handleInputChange(e) {
    setBody(e.target.value);
    setFormChanged(true);
  }
  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!fileIsValid(selectedFile)) {
        fireSwal("error", "File must be an image and it's size must be less than 2 MB");
        return;
      }
      setFormChanged(true);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }
  function handleFileCancel(e) {
    setFile(null);
    setPreviewUrl(null);
    fileInputRef.current.value = null;
  }
  function handleDeleteOldFile() {
    setFormChanged(true);
    setUserDeletedOldFile(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (body.trim() === "" && !file) {
      fireToast("error", "Invalid Post (write something or add a photo) !");
      return;
    }
    props.handleModalClose();
    if (currentPost) {
      const editedPost = {
        id: currentPost.id,
        body,
      };
      updatePost(editedPost, file, userDeletedOldFile);
    } else {
      const newPost = {
        body,
        image: null,
        user: {
          uid: loggedUser.uid,
          avatar: loggedUser.collData.avatar,
          name: loggedUser.collData.name,
        },
        createdAt: Date.now(),
        likeCount: 0,
        commentCount: 0,
      };
      addPost(newPost, file);
    }
  }
  function togglePickerVisible() {
    setPickerVisible(prevPickerVisible => !prevPickerVisible);
  }
  function handleEmojiClick(emoji) {
    setFormChanged(true);
    setBody(prevBody => {
      return prevBody + " " + emoji.native;
    });
  }
  return (
    <Dialog
      open={props.modalOpen}
      fullWidth
      maxWidth="sm"
      scroll="body"
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      transitionDuration={{ enter: 500, exit: 0.11 }}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle className={classes.title}>
        {currentPost ? "Edit Post" : "Create Post"}
        <IconButton onClick={handleClose} className={classes.closeButton} color="secondary">
          <Icon className="fa fa-close" />
        </IconButton>
      </DialogTitle>

      <Paper elevation={5}>
        <Box py={2} px={2}>
          <div className={classes.header}>
            <IconButton className={classes.headerAvatar}>
              <Avatar alt="Cindy Baker" src={loggedUser.collData.avatar} />
            </IconButton>
            <Typography variant="overline" className={classes.headerName}>
              {loggedUser.collData.name}
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            <TextField
              value={body}
              onChange={handleInputChange}
              id="outlined-multiline-static"
              placeholder={`What's on your mind, ${loggedUser.collData.name} ?`}
              multiline
              rows={4}
              fullWidth
            />
            <Box mt={2} />
            {pickerVisible && <Picker onSelect={handleEmojiClick} style={{ width: "auto" }} />}
            {file && previewUrl && (
              <>
                <h2 className={classes.imageTitle}>New Post Image </h2>
                <div className={classes.imageDiv}>
                  <Button onClick={handleFileCancel} style={{ marginBottom: "10px" }} color="secondary" variant="contained">
                    <Icon className="fa fa-close" />
                  </Button>
                  <img src={previewUrl} className={classes.image} alt="preview" width="100" height="104" />
                </div>
              </>
            )}
            {currentPost && currentPost.image && !previewUrl && !userDeletedOldFile && (
              <>
                <h2 className={classes.imageTitle}>Old Post Image</h2>
                <div className={classes.imageDiv}>
                  <Button onClick={handleDeleteOldFile} color="secondary" style={{ marginBottom: "10px" }} variant="contained">
                    <Icon className="fa fa-close" />
                  </Button>
                  <img src={currentPost.image} className={classes.image} alt="Post" width="100" height="104" />
                </div>
              </>
            )}
            <Box mt={1}>
              <Button
                type="button"
                startIcon={<Icon className="fa fa-smile-o" />}
                variant="contained"
                fullWidth
                style={{ backgroundColor: "yellow" }}
                onClick={togglePickerVisible}
              >
                Feelings
              </Button>
            </Box>
            <Box mt={1}>
              <label htmlFor="icon-button-file">
                <Button
                  type="button"
                  startIcon={<Icon className="fa fa-camera" />}
                  color="secondary"
                  variant="contained"
                  fullWidth
                  aria-label="upload picture"
                  component="span"
                >
                  {currentPost ? "Update photo" : "Add photo"}
                </Button>
              </label>
              <input ref={fileInputRef} onChange={handleFileChange} id="icon-button-file" className={classes.inputFile} type="file" />
            </Box>
            <Box mt={1}>
              <Button
                startIcon={<Icon className="fa fa-check" />}
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                style={currentPost && { backgroundColor: "green" }}
              >
                {currentPost ? "Save" : "Post"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Dialog>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    currentPost: state.postReducer.currentPost,
  };
};
export default connect(mapStateToProps, { addPost, updatePost })(PostForm);
