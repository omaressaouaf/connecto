import { Box, Grid, Paper } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import SearchedUserItem from "../../components/users/SearchedUserItem";
import { useTitle } from "../../helpers";
import { searchUsers } from "../../redux/actions/userActions";

function SearchedUsers({ loading, searchUsers, users }) {
  useTitle("Search");
  const history = useHistory();
  const queryStrings = new URLSearchParams(useLocation().search);
  const name = queryStrings.get("name");
  useEffect(() => {
    if (!name) {
      history.push("/404");
      return;
    }
    searchUsers(name);

    // eslint-disable-next-line
  }, [name]);
  return loading ? (
    <>
      <h1 className="lead" style={{ textAlign: "center" }}>
        Searching For Users ....
      </h1>
      <h1 className="lead" style={{ textAlign: "center" }}>
        <i className="fa fa-spinner fa-spin" style={{fontSize : '2.5em' , color : 'blue'}}/>
      </h1>
    </>
  ) : (
    <>
      <h1 className="lead" style={{ textAlign: "center" }}>
        Search Results for <span style={{ color: "blue" }}>'{name}'</span>
      </h1>
      <Grid container spacing={3}>
        {!users.length && (
          <Box mt={4} style={{ margin: "auto", width: "50%" }}>
            <Paper elevation={5}>
              <Alert severity="warning" >
                <AlertTitle>No Users with this name were found</AlertTitle>
                <ul style={{ padding: "0" }}>
                  <li>The query must be a name of some user</li>
                  <li>Try more specific key words</li>
                </ul>
              </Alert>
            </Paper>
          </Box>
        )}
        {users.map(user => {
          return <SearchedUserItem key={user.id} user={user} />;
        })}
      </Grid>
    </>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.uiReducer.loading.SearchedUsers,
    users: state.userReducer.users,
  };
};
export default connect(mapStateToProps, { searchUsers })(SearchedUsers);
