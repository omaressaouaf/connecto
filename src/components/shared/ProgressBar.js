import { Box, Button, CircularProgress, LinearProgress, Paper, Typography } from "@material-ui/core";
import React from "react";

export default function ProgressBar({ progress, cancelUploadFile }) {
  return (
    <Paper style={{ padding: "13px", marginTop: "20px" }}>
      <h3 style={{ textAlign: "center", fontWeight: "300" }}> Progress (do not reload)</h3>
      <Box display="flex" mt={1} alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={progress.percentage} />
        </Box>
        <Box minWidth={35} position="relative" style={{ marginLeft: "5px" }} display="inline-flex">
          <CircularProgress style={{ color: "green" }} />
          <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="caption" component="div" color="textSecondary">{`${progress.percentage}%`}</Typography>
          </Box>
        </Box>
      </Box>
      {progress.isUploading && (
        <Button onClick={cancelUploadFile} variant="contained" color="secondary" fullWidth>
          Cancel
        </Button>
      )}
    </Paper>
  );
}
