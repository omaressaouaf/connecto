import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, MenuItem, Menu, Box, Icon, Button, Container, Avatar, Fab } from "@material-ui/core";
import { NavLink, Link } from "react-router-dom";
import Notifications from "../notifications/Notifications";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/authActions";

import PostForm from "../posts/PostForm";
import SearchForm from "../users/SearchForm";
import ThemeSwitch from "../shared/ThemeSwitch";
import { useAppTheme } from "../../contexts/AppThemeContext";

function Navbar(props) {
  // my stuff
  const { loggedUser, logout } = props;

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
    handleMenuClose();
  }
  // material ui stuff
  const { darkMode } = useAppTheme();

  const useStyles = makeStyles(theme => ({
    grow: {
      flexGrow: 1,
    },

    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },

    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    appbar: {
      zIndex: "1000",
    },
    rightDiv: {
      [theme.breakpoints.up("lg")]: {
        marginRight: "12%",
      },

      [theme.breakpoints.down("md")]: {
        marginRight: "1%",
      },
    },
    circle: {
      backgroundColor: darkMode && `${fade(theme.palette.common.white, 0.15)} !important`,
      "&:hover": {
        backgroundColor: darkMode && `${fade(theme.palette.common.white, 0.25)} !important`,
      },
    },
  }));
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const renderSharedMenuItems = () => {
    return (
      <div>
        <MenuItem component={Link} to={"/users/" + loggedUser.uid} onClick={handleMenuClose}>
          <IconButton aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit" style={{ padding: "5px" }}>
            <Avatar style={{ padding: "0px" }} alt="Cindy Baker" src={loggedUser.collData.avatar} />
          </IconButton>
          <Box ml={1} />
          <p>Profile</p>
        </MenuItem>
        <MenuItem component={Link} to="/profile/settings" onClick={handleMenuClose}>
          <IconButton aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
            <Icon className="fa fa-cog" />
          </IconButton>
          <Box ml={1} />
          <p>Settings</p>
        </MenuItem>
        <MenuItem>
          <ThemeSwitch />

          <Box ml={1} />
          <p>Dark Mode</p>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <IconButton aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
            <Icon className="fa fa-sign-out" />
          </IconButton>
          <Box ml={1} />
          <p>Log out</p>
        </MenuItem>
      </div>
    );
  };

  return (
    <div className={classes.grow}>
      {/* ---------------------------------------------------------------------------------------- */}
      {/* Normal navbar with appbar and toolbar */}
      <AppBar position="fixed" style={darkMode ? { backgroundColor: "#242526" } : null} className={classes.appbar}>
        <Container>
          <Toolbar>
            {/* -------------------------------------------------------------------------------------- */}
            {/* this will  show on desktop as well as mobile screens */}
            {loggedUser ? (
              <IconButton
                size="medium"
                style={{ marginRight: "6px" }}
                component={NavLink}
                to="/"
                activeClassName={darkMode ? classes.circle : "active"}
                exact={true}
                color="inherit"
                aria-label="open drawer"
              >
                <Icon className="fa fa-home" />
              </IconButton>
            ) : (
              <Icon className="fa fa-home" style={{ marginRight: "6px" }} />
            )}

            <Typography className={`${classes.sectionDesktop} brand`} variant="h6" noWrap>
              ConnecTo
            </Typography>

            {loggedUser && <SearchForm />}

            <div className={classes.grow} />
            {loggedUser && (
              <>
                <Box mr={1.5} className={classes.sectionDesktop}>
                  <IconButton
                    component={NavLink}
                    to={"/users/" + loggedUser.uid}
                    className={classes.circle}
                    style={{ borderRadius: 28, backgroundColor: "#3e53ca" }}
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <Avatar alt="Cindy Baker" src={loggedUser.collData.avatar} />
                    <Typography style={{ marginLeft: "8px" }} variant="overline">
                      {loggedUser.collData.name}
                    </Typography>
                  </IconButton>
                </Box>

                <Box mr={1}>
                  <Notifications />
                </Box>
                <Box mr={1} className={classes.sectionDesktop}>
                  <IconButton size="medium" onClick={handleModalOpen} className={`active ${classes.circle}`} color="inherit">
                    <Icon className="fa fa-plus" />
                  </IconButton>
                  <PostForm modalOpen={modalOpen} handleModalClose={handleModalClose} />
                </Box>
              </>
            )}
            {/* -------------------------------------------------------------------------------------- */}
            {/* this will only show on desktop screens */}
            <div className={`${classes.sectionDesktop}  ${classes.rightDiv}`}>
              {loggedUser ? (
                <>
                  <Fab onClick={handleProfileMenuOpen} className={classes.circle} size="medium" color="primary" aria-label="add">
                    <Icon className="fa fa-caret-down" />
                  </Fab>

                  {/* desktop collapsible menu */}
                  <Menu
                    className={classes.sectionDesktop}
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    id="primary-search-account-menu"
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                  >
                    {renderSharedMenuItems()}
                  </Menu>
                </>
              ) : (
                <>
                  <Button startIcon={<Icon className="fa fa-sign-in" />} color="inherit" component={NavLink} to="/login" className="nav-link">
                    Login
                  </Button>
                  <Button startIcon={<Icon className="fa fa-user-plus" />} color="inherit" component={NavLink} to="/register" className="nav-link">
                    Register
                  </Button>
                </>
              )}
            </div>

            {/* -------------------------------------------------------------------------------------- */}
            {/* this will only show on mobile screens */}
            <div className={classes.sectionMobile}>
              <IconButton aria-label="show more" aria-controls="primary-search-account-menu-mobile" aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
                <Icon className="fa fa-bars " />
              </IconButton>
              {/* mobile collapsible menu */}
              <Menu
                className={classes.sectionMobile}
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                id="primary-search-account-menu-mobile"
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
              >
                {loggedUser ? (
                  renderSharedMenuItems()
                ) : (
                  <div>
                    <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                      <IconButton aria-label="show 4 new mails" color="inherit">
                        <Icon className="fa fa-sign-in" />
                      </IconButton>
                      <Box ml={1} />
                      <p>Login</p>
                    </MenuItem>
                    <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
                      <IconButton aria-label="show 11 new notifications" color="inherit">
                        <Icon className="fa fa-user-plus" />
                      </IconButton>
                      <Box ml={1} />
                      <p>Register</p>
                    </MenuItem>

                    <MenuItem>
                      <ThemeSwitch />
                      <Box ml={1} />
                      <p>Dark Mode</p>
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
  };
};
export default connect(mapStateToProps, { logout })(Navbar);
