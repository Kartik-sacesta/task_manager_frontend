import React from "react";
import { Grid, Skeleton, Paper, Box, Typography } from "@mui/material";

const DashboardSkeleton = () => {
  return (
    <Box>
      {/* Skeleton for Top Analytics Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Skeleton variant="rounded" height={100} />
          </Grid>
        ))}
      </Grid>

      {/* Skeleton for Chart Paper Section */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          mt: 4,
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "medium", mb: 3 }}
        >
          <Skeleton width="50%" />
        </Typography>

        <Box sx={{ height: 400, width: "100%" }}>
          <Skeleton variant="rectangular" height="100%" />
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardSkeleton;
