import { useEffect } from "react";
import { Container, createMuiTheme, Paper, ThemeProvider } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/users/Profile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthRoute from "./components/routes/AuthRoute";
import GuestRoute from "./components/routes/GuestRoute";
import PostSingle from "./components/posts/PostSingle";
import ProfileSettings from "./pages/users/ProfileSettings";
import { connect } from "react-redux";
import { authStateChanged } from "./redux/actions/authActions";
import SearchedUsers from "./pages/users/SearchedUsers";
import NotFound from "./pages/NotFound";
import FollowSuggestions from "./components/users/FollowSuggestions";
import { useAppTheme } from "./contexts/AppThemeContext";

function App(props) {
  const { authStateChanged, authReady } = props;
  const { darkMode } = useAppTheme();
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      background: {
        paper: darkMode ? "#242526" : "#fff",
        toolbar: "#fff",
      },
      // primary: {
      //   main:  darkMode ? '#fff': '#3F51B5',
      // },
    },
  });
  useEffect(() => {
    let unsub;
    authStateChanged().then(unsubscribe => (unsub = unsubscribe));
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);
  return authReady ? (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Paper className="app" style={darkMode ? { backgroundColor: "#18191A" } : { backgroundColor: "#f6f6ff" }}>
          <header>
            <Navbar />
          </header>
          <main>
            <Container className="container">
              <Switch>
                {/* login ,regiter ,password reset routes */}
                <GuestRoute path="/login" component={Login} />
                <GuestRoute path="/register" component={Register} />
                <GuestRoute path="/forgot-password" component={ForgotPassword} />

                {/* posts routes */}
                <AuthRoute path="/" exact component={Home} />
                <AuthRoute path="/posts/:id" component={PostSingle} />

                {/* user routes */}
                <AuthRoute path="/users/:userId" component={Profile} />
                <AuthRoute path="/profile/settings" component={ProfileSettings} />
                <AuthRoute path="/search" component={SearchedUsers} />
                <AuthRoute path="/users" component={FollowSuggestions} />

                {/* error routes */}
                <Route path="*" exact={true} component={NotFound} />
              </Switch>
            </Container>
          </main>
          <footer>
            <Footer />
          </footer>
        </Paper>
      </ThemeProvider>
    </BrowserRouter>
  ) : (
    <div id="preloder">
      <div className="loader"></div>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    authReady: state.authReducer.authReady,
  };
};
export default connect(mapStateToProps, { authStateChanged })(App);
