import { Badge, Icon, IconButton, Menu, MenuItem } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchNotifications, markNotificationsRead } from "../../redux/actions/notificationActions";
import NotificationItem from "./NotificationItem";

function Notifications({ loggedUser, fetchNotifications, notifications, markNotificationsRead }) {
  // material ui stuff
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    markNotificationsRead();
  };

  // my stuff

  useEffect(() => {
    let unsub;
    fetchNotifications(loggedUser).then(unsubscribe => (unsub = unsubscribe));
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <IconButton aria-label="show 17 new notifications" onClick={handleClick} color="inherit">
        <Badge badgeContent={notifications.filter(notif => !notif.read).length} showZero={true} color="secondary">
          <Icon className="fa fa-bell" />
        </Badge>
      </IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {!notifications.length && (
          <MenuItem>
            <Alert severity="info">No notification for now</Alert>
          </MenuItem>
        )}
        {notifications.map(notification => {
          return (
            <MenuItem onClick={handleClose} key={notification.id}>
              <NotificationItem notification={notification} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    notifications: state.notificationReducer.notifications,
  };
};

export default connect(mapStateToProps, { fetchNotifications, markNotificationsRead })(Notifications);
