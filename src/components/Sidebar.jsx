import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Button,
  Avatar,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Task as TaskIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

const SIDEBAR_WIDTH = 280;

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const userdata = JSON.parse(localStorage.getItem("userdata") || "{}");

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      roles: ["Admin"],
    },
    {
      path: "/user",
      label: "Users",
      icon: <PeopleIcon />,
      roles: ["Admin"],
    },
    {
      path: "/task",
      label: "Tasks",
      icon: <TaskIcon />,
      roles: ["User"],
    },
    {
      path: "/notification",
      label: "Notification",
      icon: <NotificationsIcon />,
      roles: ["User"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userdata.role)
  );

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    localStorage.removeItem("userdata");
    window.location.href = "/";
  };

  const getUserInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "User":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        background: "linear-gradient(135deg, #050a2c, #0a1a4e)",
        color: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        boxShadow: 2,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxSizing: "border-box",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          
          color: "inherit",
          minHeight: '64px',
          gap: '0.75rem',
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Taskbar
        </Typography>
      </Box>

      <Box sx={{ p: 2, color: "inherit" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                fontSize: "1rem",
              }}
            >
              {getUserInitials(userdata.username)}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                fontSize={20}
                sx={{ color: "inherit", fontWeight: "bold" }}
              >
                {userdata.username || "User"}
              </Typography>
              <Chip
                label={userdata.role || "Guest"}
                size="small"
                color={getRoleColor(userdata.role)}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, p: 1, overflowY: 'auto' }}>
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  minHeight: 48,
                  justifyContent: "initial",
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "#ffffff",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  transition: theme.transitions.create('background-color', {
                    duration: theme.transitions.duration.shortest,
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                    color:
                      location.pathname === item.path
                        ? "#ffffff"
                        : "inherit",
                    transition: theme.transitions.create('margin-right', {
                      duration: theme.transitions.duration.shortest,
                    }),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight:
                      location.pathname === item.path ? "bold" : "normal",
                  }}
                  sx={{
                      opacity: 1,
                      transition: theme.transitions.create('opacity', {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen,
                      }),
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            justifyContent: "initial",
            overflow: 'hidden',
            "&:hover": {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            },
            transition: theme.transitions.create('background-color', {
              duration: theme.transitions.duration.shortest,
            }),
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
