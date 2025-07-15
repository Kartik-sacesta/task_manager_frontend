import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export const LoginFormSkeleton = () => (
  <Box
    sx={{
      maxWidth: 360,
      width: "100%",
      textAlign: "center",
      padding: "1rem",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Skeleton
        variant="rounded"
        width="100%"
        height={56}
        sx={{ borderRadius: "0.375rem" }}
        animation="wave"
      />

      <Skeleton
        variant="rounded"
        width="100%"
        height={56}
        sx={{ borderRadius: "0.375rem" }}
        animation="wave"
      />
    </Box>

    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ my: 1 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Skeleton variant="rectangular" width={16} height={16} />
        <Skeleton variant="text" width={100} height={20} />
      </Box>
      <Skeleton variant="text" width={100} height={20} />
    </Stack>

    <Skeleton
      variant="rounded"
      width="100%"
      height={48}
      sx={{ mt: 2, mb: 1, borderRadius: "0.375rem" }}
      animation="wave"
    />

    <Skeleton
      variant="rounded"
      width="100%"
      height={48}
      sx={{ mt: 1, borderRadius: "0.375rem" }}
      animation="wave"
    />

    <Box sx={{ my: 2 }}>
      <Skeleton variant="text" width="100%" height={1} />
    </Box>

    <Box sx={{ mt: 2 }}>
      <Skeleton variant="text" width="60%" height={20} sx={{ mx: "auto" }} />
    </Box>
  </Box>
);

export const LoginLeftSideSkeleton = () => (
  <Box sx={{ maxWidth: 360 }}>
    <Skeleton
      variant="text"
      width="100%"
      height={60}
      sx={{ fontSize: "2.5rem", mb: 1 }}
      animation="wave"
    />
    <Skeleton
      variant="text"
      width="90%"
      height={60}
      sx={{ fontSize: "2.5rem", mb: 2 }}
      animation="wave"
    />

    <Skeleton
      variant="text"
      width="85%"
      height={24}
      sx={{ fontSize: "1rem", mb: 0.5 }}
      animation="wave"
    />
    <Skeleton
      variant="text"
      width="70%"
      height={24}
      sx={{ fontSize: "1rem" }}
      animation="wave"
    />
  </Box>
);

export const LoginPageSkeleton = () => (
  <Box
    sx={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    }}
  >
    <Box
      sx={{
        flex: 1,
        background: "linear-gradient(135deg, #050a2c, #0a1a4e)",
        color: "#fff",
        padding: "2rem",
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      <LoginLeftSideSkeleton />
    </Box>

    <Box
      sx={{
        flex: 1,
        background: "#fff",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LoginFormSkeleton />
    </Box>
  </Box>
);
