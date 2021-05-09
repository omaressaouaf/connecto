import { Grid, Hidden } from "@material-ui/core";
import React from "react";
import FollowSuggestions from "../components/users/FollowSuggestions";
import Posts from "../components/posts/Posts";
import { useTitle } from "../helpers";

export default function Home() {
  useTitle();
  return (
    <Grid container spacing={5}>
      <Grid item md={7} lg={7} sm={12} xs={12}>
        <Posts />
      </Grid>
      <Hidden only={["sm", "xs"]}>
        <Grid item md={4} lg={4}>
          <FollowSuggestions />
        </Grid>
      </Hidden>
    </Grid>
  );
}
