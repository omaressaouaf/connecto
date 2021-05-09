import { Box, makeStyles } from "@material-ui/core";
import { Icon, Paper, Avatar, fade } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PostForm from "./PostForm";
import { useAppTheme } from "../../contexts/AppThemeContext";

function PostFormPrv(props) {
  // material ui stuff
  const { darkMode } = useAppTheme();
  const useStyles = makeStyles(theme => ({
    prv: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "15px",
      boxShadow: "0px 5px 7px -7px rgba(0,0,0,0,75)",
      width: "100%",
    },
    prvTop: {
      display: "flex",
      borderBottom: darkMode ? "1px solid #5c5f63" : "1px solid #eff2f5",
      padding: "15px",
    },
    prvForm: {
      flex: 1,
      display: "flex",
      backgroundColor: "inherit",
    },
    prvInput: {
      outlineWidth: 0,
      border: "none",
      padding: "5px 20px",
      margin: "0 10px",
      borderRadius: "999px",
      backgroundColor: darkMode ? fade(theme.palette.common.white, 0.15) : "#eff2f5",
      "&:hover": {
        backgroundColor: darkMode ? fade(theme.palette.common.white, 0.25) : "#cccccc",
      },

      cursor: "pointer",
      flex: "1",
    },
    prvBottom: {
      display: "flex",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    prvOption: {
      padding: "20px",
      display: "flex",
      color: "grey",
      margin: "5px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: darkMode ? "#5c5f63" : "#eff2f5",
        borderRadius: "20px",
      },
    },
    prvOptionText: {
      color: darkMode && "#ededed",
      marginLeft: "10px",
      fontWeight: "400",
    },
  }));
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setPickerVisible(prevPickerVisible => false);
    setModalOpen(prevModalOpen => true);
  };
  const handleModalClose = () => {
    setPickerVisible(prevPickerVisible => false);
    setModalOpen(prevModalOpen => false);
  };

  // my stuff
  const { loggedUser } = props;
  const [pickerVisible, setPickerVisible] = useState(false);
  const handleModalOpenWithPicker = () => {
    setPickerVisible(prevPickerVisible => true);
    setModalOpen(prevModalOpen => true);
  };
  return (
    <Box mx={1}>
      <Paper elevation={5} className={classes.prv}>
        <div className={classes.prvTop}>
          <Link to={"/users/" + loggedUser.uid}>
            <Avatar alt="Cindy Baker" src={loggedUser.collData.avatar} />
          </Link>

          <form className={classes.prvForm}>
            <div className={classes.prvInput} onClick={handleModalOpen}>
              What's on your mind, {loggedUser.collData.name} ?
            </div>
          </form>
        </div>
        <div className={classes.prvBottom}>
          <div className={classes.prvOption}>
            <Icon className="fa fa-video-camera" style={{ color: "red" }} /> <span className={classes.prvOptionText}>Live videos</span>
          </div>
          <label htmlFor="icon-button-file">
            <div className={classes.prvOption} onClick={handleModalOpen}>
              <Icon className="fa fa-picture-o" style={{ color: "green" }} /> <span className={classes.prvOptionText}>Photos</span>
            </div>
          </label>
          <div onClick={handleModalOpenWithPicker} className={classes.prvOption}>
            <Icon className="fa fa-smile-o" style={{ color: "yellow" }} /> <span className={classes.prvOptionText}>Feelings</span>
          </div>
        </div>
      </Paper>
      <PostForm modalOpen={modalOpen} pickerVisible={pickerVisible} handleModalClose={handleModalClose} />
    </Box>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};
export default connect(mapStateToProps, null)(PostFormPrv);
