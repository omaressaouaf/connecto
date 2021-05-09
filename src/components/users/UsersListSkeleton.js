import React from "react";
import { Paper, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

export default function UsersListSkeleton() {
  const items = [];
  for (let i = 0; i < 3; i++) {
    items.push(
      <Box key={i} mb={3} display="flex" alignItems="center">
        <Box flexGrow={0.1}>
          <Skeleton
            animation="wave"
            variant="circle"
            style={{
              marginLeft: "10px",
              width: "40px",
              height: "40px",
            }}
          />
        </Box>

        <Box flexGrow={2} style={{ marginTop: "7px" }}>
          <Skeleton animation="wave" variant="text" height={10} />
          <br />
          <Skeleton animation="wave" variant="text" height={10} />
        </Box>
      </Box>
    );
  }

  return <Paper style={{padding : '20px'}}>{items}</Paper>;
}
