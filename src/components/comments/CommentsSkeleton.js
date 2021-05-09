import React from "react";
import { Paper, CardHeader } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

export default function CommentsSkeleton() {
  let skeletons = [];
  for (let i = 0; i < 6; i++) {
    skeletons.push(
      <CardHeader
        key={i}
        avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
        title={<Skeleton animation="wave" height={7} width="80%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton animation="wave" height={5} width="40%" />}
      />
    );
  }
  return (
    <Paper elevation={5} style={{ maxWidth: 845, marginTop: 25 }}>
      {skeletons}
    </Paper>
  );
}
