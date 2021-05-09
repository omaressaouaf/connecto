import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Typography, TextField, FormControl, Box, Button, Card, CardContent, Grid, Icon } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { connect } from "react-redux";
import { signup } from "../../redux/actions/authActions";
import { useTitle } from "../../helpers";

function Register(props) {
  useTitle("Register");
  const { signup, loading } = props;
  const [serverError, setServerError] = useState(null);

  // form validation with react form hook and yup
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Enter a valid Email"),
    password: yup.string().required("Password is required").min(6, "Password should at least be 6 characters"),
    passwordConfirm: yup
      .string()
      .required("Confirmation is required")
      .oneOf([yup.ref("password")], "Confirmation must match Password"),
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit({ email, password, name }) {
    setServerError(null);
    signup(email, password, name).catch(err => setServerError(err));
  }

  return (
    <Grid container>
      <Grid item xs={1} md={2} lg={3} />
      <Grid item xs={12} md={8} lg={6}>
        <Card className="form">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box m={2} pt={3}>
                <Typography align="center" variant="h4" m="wewe">
                  Create an Account
                </Typography>
              </Box>
              {serverError && <Alert severity="error">{serverError.message}</Alert>}
              <Box mb={2} />
              <FormControl fullWidth>
                <TextField
                  name="name"
                  error={errors.name ? true : false}
                  helperText={errors.name && errors.name.message}
                  inputRef={register}
                  label="Enter your Full Name"
                />
              </FormControl>
              <Box mb={4} />
              <FormControl fullWidth>
                <TextField
                  name="email"
                  error={errors.email ? true : false}
                  helperText={errors.email && errors.email.message}
                  inputRef={register}
                  label="Enter your Email"
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
              <Box m={4} />
              <FormControl fullWidth>
                <TextField
                  name="passwordConfirm"
                  error={errors.passwordConfirm ? true : false}
                  helperText={errors.passwordConfirm && errors.passwordConfirm.message}
                  inputRef={register}
                  type="password"
                  label="Confirm your Password"
                />
              </FormControl>

              <Box my={4}>
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  color="primary"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <Icon className="fa fa-circle-o-notch fa-spin" />}
                >
                  Register
                </Button>
              </Box>

              <Typography align="center" variant="subtitle1">
                Already have an account ? <NavLink to="/login">Login</NavLink>
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
    loading: state.uiReducer.loading.Register,
  };
};

export default connect(mapStateToProps, { signup })(Register);
