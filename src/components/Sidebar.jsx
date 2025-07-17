import React, { useState } from "react";
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
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Task as TaskIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Category as CategoryIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
const SIDEBAR_WIDTH = 280;
const COLLAPSED_SIDEBAR_WIDTH = 70;

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const userdata = JSON.parse(localStorage.getItem("userdata") || "{}");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);

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
      path: "/category",
      label: "Category",
      icon: <CategoryIcon />,
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
    {
      path: "/payment",
      label: "Payment",
      icon: <PaymentIcon />,
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

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const sidebarContent = (
    <Box
      sx={{
        width: open ? SIDEBAR_WIDTH : COLLAPSED_SIDEBAR_WIDTH,
        background: "linear-gradient(135deg, #050a2c, #0a1a4e)",
        color: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",

        ...(isMobile && {
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: 2,
          paddingBottom: "env(safe-area-inset-bottom)",
          borderRight: `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
          color: "inherit",
          minHeight: "64px",
          gap: "0.75rem",
        }}
      >
        {open && (
          <Typography variant="h5" fontWeight="bold">
            Taskbar
          </Typography>
        )}
        <IconButton onClick={handleDrawerToggle} sx={{ color: "inherit" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {open && (
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
                onClick={isMobile && open ? handleDrawerToggle : null}
                sx={{
                  borderRadius: 2,
                  mx: open ? 1 : 0,
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: open ? 2.5 : 0,
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
                  transition: theme.transitions.create("background-color", {
                    duration: theme.transitions.duration.shortest,
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      location.pathname === item.path ? "#ffffff" : "inherit",
                    transition: theme.transitions.create("margin-right", {
                      duration: theme.transitions.duration.shortest,
                    }),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight:
                        location.pathname === item.path ? "bold" : "normal",
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: theme.transitions.create("opacity", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}
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
            justifyContent: open ? "initial" : "center",
            overflow: "hidden",
            "&:hover": {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            },
            transition: theme.transitions.create("background-color", {
              duration: theme.transitions.duration.shortest,
            }),
            "& .MuiButton-startIcon": {
              marginRight: open ? 8 : 0,
            },
            minWidth: open ? "auto" : 0,
          }}
        >
          {open && "Logout"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SIDEBAR_WIDTH,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1000,
            boxShadow: 2,
            paddingBottom: "env(safe-area-inset-bottom)",
            borderRight: `1px solid ${theme.palette.divider}`,
            width: open ? SIDEBAR_WIDTH : COLLAPSED_SIDEBAR_WIDTH,
            background: "linear-gradient(135deg, #050a2c, #0a1a4e)",
            color: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
};

export default Sidebar;
