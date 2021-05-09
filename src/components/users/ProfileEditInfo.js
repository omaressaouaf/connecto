import { TextField, makeStyles, Box, Button, Icon, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { connect } from "react-redux";
import { updateProfileInfo } from "../../redux/actions/authActions";

const useStyles = makeStyles({
  title: {
    fontWeight: "400",
    textAlign: "center",
  },
});
function ProfileEditInfo(props) {
  // material ui stuff
  const classes = useStyles();
  //   ____________________________________________________________________________-
  // my stuff
  const { loggedUser, updateProfileInfo, loading } = props;
  const [msg, setMsg] = useState(null);
  const [serverError, setServerError] = useState(null);

  // form validation with react form hook and yup
  const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Enter a valid Email"),
    name: yup.string().required("Name is required"),
  });
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: loggedUser.email,
      name: loggedUser.collData.name,
      bio: loggedUser.collData.bio,
    },
  });

  function onSubmit({ email, name, bio }) {
    setServerError(null);
    setMsg(null);

    updateProfileInfo(email, name, bio)
      .then(msg => setMsg(msg))
      .catch(err => setServerError(err));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Box mb={2} pt={3}>
        <h1 className={classes.title}>Edit Profile Info</h1>
      </Box>
      {msg && <Alert severity="success">{msg}</Alert>}
      {serverError && <Alert severity="error">{serverError.message}</Alert>}

      <Box my={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              name="email"
              error={errors.email ? true : false}
              helperText={errors.email && errors.email.message}
              inputRef={register}
              fullWidth
              label="Email"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              name="name"
              error={errors.name ? true : false}
              helperText={errors.name && errors.name.message}
              inputRef={register}
              fullWidth
              variant="outlined"
              label="Full Name"
            />
          </Grid>
        </Grid>
      </Box>
      <Box my={2}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField name="bio" inputRef={register} fullWidth multiline rows={3} label="Bio (Something about you) ..." variant="outlined" />
          </Grid>
        </Grid>
      </Box>

      <Button
        disabled={loading}
        startIcon={loading ? <Icon className="fa fa-circle-o-notch fa-spin" /> : <Icon className="fa fa-check" />}
        type="submit"
        fullWidth
        size="large"
        color="primary"
        variant="contained"
      >
        Save
      </Button>
    </form>
  );
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    loading: state.uiReducer.loading.ProfileEditInfo,
  };
};
export default connect(mapStateToProps, { updateProfileInfo })(ProfileEditInfo);
