import React from "react";
import { Drawer, Box, Stack, Skeleton, useTheme } from "@mui/material";

export default function Commonskeleton({
  sidebarOpen = true,
  sidebarWidth = 240,
  rows = 10,
}) {
  const theme = useTheme();

  return (
    <Box display="flex">
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <Box p={2} height="100%" display="flex" flexDirection="column">
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={100} height={32} />
          </Stack>

          <Stack spacing={2}>
            {["Dashboard", "Users", "Category", "Settings"].map((_, idx) => (
              <Stack
                key={idx}
                direction="row"
                alignItems="center"
                spacing={1.5}
              >
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={120} height={24} />
              </Stack>
            ))}
          </Stack>

          <Box flexGrow={1} />
          <Skeleton variant="rectangular" width="80%" height={40} />
        </Box>
      </Drawer>

      <Box flexGrow={1} p={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Stack>

        <Box display="flex" my={2} px={1}>
          <Skeleton variant="text" width="30%" sx={{ mr: 2 }} />
          <Skeleton variant="text" width="40%" sx={{ mr: 2 }} />
          <Skeleton variant="text" width="20%" />
        </Box>

        {Array.from({ length: rows }).map((_, idx) => (
          <Box
            key={idx}
            display="flex"
            alignItems="center"
            bgcolor={theme.palette.action.hover}
            borderRadius={1}
            px={1}
            py={1}
            mb={1}
          >
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ mr: 2 }}
            />
            <Skeleton variant="text" width="25%" sx={{ mr: 2 }} />
            <Skeleton variant="text" width="35%" sx={{ mr: 2 }} />
            <Skeleton variant="rectangular" width={40} height={24} />
          </Box>
        ))}

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Skeleton variant="rectangular" width={160} height={36} />
        </Box>
      </Box>
    </Box>
  );
}
