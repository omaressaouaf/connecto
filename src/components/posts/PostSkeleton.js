import { Paper, CardContent, CardHeader, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

export default function PostSkeleton() {
  return (
    <Box  mx={1}>
      <Paper elevation={5} style={{ maxWidth: 10000, marginTop: 25 }}>
        <CardHeader
          avatar={<Skeleton animation="wave" variant="circle" width={40} height={45} />}
          title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton animation="wave" variant="rect" style={{ height: 290 }} />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        </CardContent>
      </Paper>
    </Box>
  );
}
