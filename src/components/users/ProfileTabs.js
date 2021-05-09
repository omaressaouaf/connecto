import React from "react";
import Followers from "../../components/users/Followers";
import Followings from "../../components/users/Followings";
import Posts from "../../components/posts/Posts";
import { Paper, Tab, Tabs ,Box , Icon } from "@material-ui/core";



// custom tabpanel component to render panels with tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
export default function ProfileTabs() {
  // material ui stuff

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper square>
        <Tabs centered value={value} onChange={handleChange} variant="fullWidth" indicatorColor="secondary" textColor="secondary" aria-label="icon label tabs example">
          <Tab icon={<Icon className="fa fa-newspaper-o" />} label="posts" />
          <Tab icon={<Icon className="fa fa-users" />} label="followers" />
          <Tab icon={<Icon className="fa fa-user-plus" />} label="followings" />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
        <Posts />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Followers />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Followings />
      </TabPanel>
    </>
  );
}
