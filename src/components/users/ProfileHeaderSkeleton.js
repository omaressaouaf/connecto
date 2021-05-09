import { Skeleton } from "@material-ui/lab";
import { Box, Grid, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
  userAvatarGrid: {
    position: "relative",
  },
  userAvatar: {
    width: "230px",
    height: "230px",
    margin: "auto",
    position: "relative",
  },
}));

export default function ProfileHeaderSkeleton() {
  const classes = useStyles();
  return (
    <Grid container className="root">
      <Grid item xs={12} sm={12} md={4} className={classes.userAvatarGrid}>
        <Skeleton animation="wave" variant="circle" className={classes.userAvatar} />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Box display="flex" alignItems="center" style={{marginTop : '20px'}}>
          <Skeleton animation="wave"  height={100} width="100%" />

        </Box>
        <Box display="flex" alignItems="center">
          <h3 className="lead" style={{ marginRight: "43px" }}>
            <Skeleton animation="wave" variant="circle" width={30} height={30} />
          </h3>
          <h3 className="lead" style={{ marginRight: "43px" }}>
            <Skeleton animation="wave" variant="circle" width={30} height={30} />
          </h3>
          <h3 className="lead" style={{ marginRight: "43px" }}>
            <Skeleton animation="wave" variant="circle" width={30} height={30} />
          </h3>
        </Box>
        <Box mb={4}>
          <Skeleton animation="wave" height={10} width="80%"  />
          <Skeleton animation="wave" height={10} width="100%"  />
        </Box>
      </Grid>
    </Grid>
  );
}
