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
  Button,
  Avatar,
  Stack,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Task as TaskIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

const SIDEBAR_WIDTH = 280;
const COLLAPSED_SIDEBAR_WIDTH = 60;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const theme = useTheme();
  const userdata = JSON.parse(localStorage.getItem("userdata") || "{}");

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon />, roles: ["Admin"] },
    { path: "/user", label: "Users", icon: <PeopleIcon />, roles: ["Admin"] },
    { path: "/task", label: "Tasks", icon: <TaskIcon />, roles: ["User"] },
    { path: "/notification", label: "Notification", icon: <NotificationsIcon />, roles: ["User"] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userdata.role));

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    localStorage.removeItem("userdata");
    window.location.href = "/";
  };

  const getUserInitials = (name) => {
    return name ? name.split(" ").map(word => word[0]).join("").toUpperCase() : "U";
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
        background: "linear-gradient(135deg, #050a2c, #0a1a4e)",
        color: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        zIndex: 1000,
        boxShadow: 2,
        paddingBottom: "env(safe-area-inset-bottom)",
        boxSizing: "border-box",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          p: collapsed ? 1.5 : 2,
         
          minHeight: "64px",
          gap: collapsed ? 0 : "0.75rem",
        }}
      >
        {!collapsed && (
          <Typography variant="h5" fontWeight="bold">
            Taskbar
          </Typography>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "inherit",
            fontSize: "20px",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>

      {!collapsed && (
        <Box sx={{ p: 2 }}>
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
              <Typography variant="body2" fontSize={20} fontWeight="bold">
                {userdata.username || "User"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}>
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
                  justifyContent: collapsed ? "center" : "initial",
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
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? "auto" : 3,
                    justifyContent: "center",
                    color: location.pathname === item.path ? "#ffffff" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? "bold" : "normal",
                    }}
                    sx={{ opacity: 1 }}
                  />
                )}
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
            justifyContent: collapsed ? "center" : "initial",
            "&:hover": {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          {!collapsed && "Logout"}
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
