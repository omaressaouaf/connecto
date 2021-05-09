import { TextField, makeStyles, Box, Button, Icon } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { connect } from "react-redux";
import { changePassword } from "../../redux/actions/authActions";

const useStyles = makeStyles({
  title: {
    fontWeight: "400",
    textAlign: "center",
  },
});
function ProfileChangePassword(props) {
  // material ui stuff
  const classes = useStyles();
  //   ____________________________________________________________________________-

  // my stuff
  const { changePassword, loading } = props;
  const [msg, setMsg] = useState(null);
  const [serverError, setServerError] = useState(null);

  // form validation with react form hook and yup
  const schema = yup.object().shape({
    currentPassword: yup.string().required("Current Password is required").min(6, "Password should at least be 6 characters"),
    newPassword: yup.string().required("New Password is required").min(6, "Password should at least be 6 characters"),
    newPasswordConfirm: yup
      .string()
      .required("Confirmation is required")
      .oneOf([yup.ref("newPassword")], "Confirmation must match new Password"),
  });
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit({ currentPassword, newPassword }) {
    setServerError(null);
    setMsg(null);
    changePassword(currentPassword, newPassword)
      .then(msg => {
        setMsg(msg);
        reset();
      })
      .catch(err => {
        setServerError(err);
      });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Box mb={2} pt={3}>
        <h1 className={classes.title}>Change Password</h1>
      </Box>
      {msg && <Alert severity="success">{msg}</Alert>}
      {serverError && <Alert severity="error">{serverError.message}</Alert>}
      <Box my={2}>
        <TextField
          name="currentPassword"
          error={errors.currentPassword ? true : false}
          helperText={errors.currentPassword && errors.currentPassword.message}
          inputRef={register}
          type="password"
          fullWidth
          label="Current Password"
        />
        <Box my={3} />
        <TextField
          name="newPassword"
          error={errors.newPassword ? true : false}
          helperText={errors.newPassword && errors.newPassword.message}
          inputRef={register}
          type="password"
          fullWidth
          label="New Password"
        />
        <Box my={3} />
        <TextField
          name="newPasswordConfirm"
          error={errors.newPasswordConfirm ? true : false}
          helperText={errors.newPasswordConfirm && errors.newPasswordConfirm.message}
          inputRef={register}
          type="password"
          fullWidth
          label="Confirmation"
        />
      </Box>
      <Button
        type="submit"
        fullWidth
        size="large"
        color="secondary"
        variant="contained"
        startIcon={loading ? <Icon className="fa fa-circle-o-notch fa-spin" /> : <Icon className="fa fa-check" />}
        disabled={loading}
      >
        Change Password
      </Button>
    </form>
  );
}
const mapStateToProps = state => {
  return {
    loading: state.uiReducer.loading.ProfileChangePassword,
  };
};
export default connect(mapStateToProps, { changePassword })(ProfileChangePassword);
