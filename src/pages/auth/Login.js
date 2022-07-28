import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Typography, TextField, FormControl, Box, Button, Card, CardContent, Icon, Grid } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { connect } from "react-redux";
import { login } from "../../redux/actions/authActions";
import { useTitle } from "../../helpers";

function Login(props) {
  useTitle("Login");
  const { login, loading } = props;
  const [serverError, setServerError] = useState(null);

  // form validation with react form hook and yup
  const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Enter a valid Email"),
    password: yup.string().required("Password is required"),
  }); 

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit({ email, password }) {
    setServerError(null);
    login(email, password).catch(err => setServerError(err));
  }

  return (
    <Grid container>
      <Grid item xs={1} md={2} lg={3} />
      <Grid item xs={12} md={8} lg={6}>
        <Card className="form">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box m={2} pt={3}>
                <Typography align="center" variant="h4">
                  Login to Your Account
                </Typography>
              </Box>
              {serverError && <Alert severity="error">{serverError.message}</Alert>}
              <Box mb={2} />

              <FormControl fullWidth>
                <TextField
                  name="email"
                  error={errors.email ? true : false}
                  helperText={errors.email && errors.email.message}
                  inputRef={register}
                  label="Enter
                your Email"
                />
              </FormControl>

              <Box m={4} />
              <FormControl fullWidth>
                <TextField
                  name="password"
                  error={errors.password ? true : false}
                  helperText={errors.password && errors.password.message}
                  inputRef={register}
                  type="password"
                  label="Enter your Password"
                />
              </FormControl>
              <Box m={2} />
              <Typography align="right" variant="subtitle1">
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                  Forgot Password ?
                </Link>
              </Typography>
              <Box my={2} />
              <Button
                type="submit"
                fullWidth
                size="large"
                color="primary"
                variant="contained"
                disabled={loading}
                startIcon={loading && <Icon className="fa fa-circle-o-notch fa-spin" />}
              >
                Login
              </Button>
              <Box my={4} />

              <Typography align="center" variant="subtitle1">
                Dont have an account ? <Link to="/register">Register </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={1} md={2} lg={3} />
    </Grid>
  );
}
const mapStateToProps = state => {
  return {
    loading: state.uiReducer.loading.Login,
  };
};

export default connect(mapStateToProps, { login })(Login);
