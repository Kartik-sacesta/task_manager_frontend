import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
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
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Task as TaskIcon,
  Logout as LogoutIcon,

} from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
const SIDEBAR_WIDTH = 280;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const userdata = JSON.parse(localStorage.getItem("userdata") || "{}");

  const menuItems = [
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

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userdata.role)
  );

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    navigate("/");
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
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >

      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Dashboard
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: 2,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                fontSize: "1rem",
              }}
            >
              {getUserInitials(userdata.name)}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "inherit", fontWeight: "bold" }}
              >
                {userdata.name || "User"}
              </Typography>
              <Chip
                label={userdata.role || "Guest"}
                size="small"
                color={getRoleColor(userdata.role)}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, p: 1 }}>
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
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.contrastText,
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.secondary,
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
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
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
            "&:hover": {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
