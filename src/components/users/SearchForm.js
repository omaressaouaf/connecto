import { Icon, IconButton, InputBase, makeStyles, fade } from "@material-ui/core";
import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  search: {
    display: "flex",
    // flexWrap : 'wrap',
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    height: "32px",
    padding: "5px",
    marginRight: theme.spacing(2),
    marginLeft: 20,
    width: "auto",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 10,
      width: "45%",
    },
  },

  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: "18px",
    transition: theme.transitions.create("width"),
  },
}));
export default function SearchForm({ searchUsers }) {
  // material ui stuff
  const classes = useStyles();

  // my stuff
  const inputRef = useRef();
  const history = useHistory();
  const handleSearch = e => {
    e.preventDefault();
    if (inputRef.current.value.trim() === "") {
      history.push("/users");
    } else {
      history.push(`/search?name=${inputRef.current.value}`);
    }
    inputRef.current.value = "";
  };
  return (
    <form onSubmit={handleSearch} className={classes.search}>
      <InputBase
        placeholder="Search…"
        inputRef={inputRef}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton type="submit" style={{ color: "white" }} className={classes.searchIcon}>
        <Icon className="fa fa-search" />
      </IconButton>
    </form>
  );
}
