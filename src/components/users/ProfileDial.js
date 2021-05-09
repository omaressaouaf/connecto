import React from "react";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import { Icon, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: "fixed",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  actionSettings: {
    textDecoration: "none",
    color: "#353b37",
  },
}));
function ProfileDial() {
  // material stuff
  const classes = useStyles();
  const [dialOpen, setDialOpen] = React.useState(false);

  //_______________________________________________________________________
  // my stuff

  return (
    <SpeedDial
      ariaLabel="SpeedDial example"
      className={classes.speedDial}
      icon={<Icon className="fa fa-plus" />}
      onClose={() => setDialOpen(false)}
      onOpen={() => setDialOpen(true)}
      open={dialOpen}
      direction="left"
    >
      <SpeedDialAction
        icon={
          <label htmlFor="file-avatar">
            <Icon color="primary" style={{ marginTop: "8px ", cursor: "pointer" }} className="fa fa-camera" />{" "}
          </label>
        }
        tooltipTitle="Choose new Avatar"
      />

      <SpeedDialAction component={Link} to="/profile/settings" icon={<Icon className={`fa fa-cog ${classes.actionSettings}`} />} tooltipTitle="Settings" />
    </SpeedDial>
  );
}

export default ProfileDial;
