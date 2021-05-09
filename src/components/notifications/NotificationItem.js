import { Avatar, Box, Typography, makeStyles, Icon } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "inherit",
    width: "100%",
    padding: "7px",
  },
  item: {
    marginRight: "20px",
    color : 'inherit'
  },
  icon: {
    position: "absolute",
    top: 30,
    left: "9%",
    zIndex: "10000000000000",
  },
});
export default function NotificationItem({ notification }) {
  // material ui stuff
  const classes = useStyles();
  // my stuff
  dayjs.extend(relativeTime);
  return (
    <Link style={!notification.read ? { backgroundColor: "#f0ede4" } : null} className={classes.link} to={notification.path}>
      <Box display="flex" flexWrap="wrap" alignItems="center">
        <Avatar src={notification.sender.avatar} className={classes.item} />
        <Icon style={{ color: notification.iconColor }} className={`${notification.icon} ${classes.icon}`} />
        <Typography variant="overline" className={classes.item}>
          {notification.title}
        </Typography>
        <Typography variant="overline" color="primary">
          ({dayjs(notification.createdAt).fromNow()})
        </Typography>
      </Box>
    </Link>
  );
}
