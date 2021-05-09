import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { Icon, Paper } from "@material-ui/core";
import ProfileEditInfo from "../../components/users/ProfileEditInfo";
import ProfileChangePassword from "../../components/users/ProfileChangePassword";
import { useTitle } from "../../helpers";

function TabPanel(props) {
  useTitle("Settings");
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" style={{ width: "100%" }} hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && (
        <Box px={4}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    height: "600px",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function ProfileSettings() {
  // material ui stuff
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // _________________________________________________________________________________________
  //   my stuff

  return (
    <Paper elevation={5} className={classes.root}>
      <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange} aria-label="Vertical tabs example" className={classes.tabs}>
        <Tab label="Edit Profile Info" icon={<Icon className="fa fa-edit" />} />
        <Tab label="Change Password" icon={<Icon className="fa fa-unlock-alt" />} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ProfileEditInfo />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <ProfileChangePassword />
      </TabPanel>
    </Paper>
  );
}
