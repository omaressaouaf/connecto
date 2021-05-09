import { Box, Dialog, DialogTitle, Icon, IconButton, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon } from "react-share";

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default function ShareDialog(props) {
  const classes = useStyles();

  const sharedUrl = `${window.location.protocol}//${window.location.host}/posts/${props.postId}`;

  return (
    <Dialog
      open={props.modalOpen}
      fullWidth
      maxWidth="sm"
      transitionDuration={{ enter: 500, exit: 0.11 }}
      onClose={props.handleModalClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle className={classes.title}>
        Share on other social media
        <IconButton onClick={props.handleModalClose} className={classes.closeButton} color="secondary">
          <Icon className="fa fa-close" />
        </IconButton>
      </DialogTitle>
      <Paper elevation={5}>
        <Box display="flex" justifyContent="space-evenly" style={{ width: "100%", padding: "50px 0px" }}>
          <FacebookShareButton url={sharedUrl}>
            <FacebookIcon size={36} />
          </FacebookShareButton>
          <WhatsappShareButton url={sharedUrl}>
            <WhatsappIcon size={36} />
          </WhatsappShareButton>
          <TwitterShareButton url={sharedUrl}>
            <TwitterIcon size={36} />
          </TwitterShareButton>
        </Box>
      </Paper>
    </Dialog>
  );
}
