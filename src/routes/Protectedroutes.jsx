import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardPage from "../pages/DashboardPage";
import Taskuserid from "../pages/Taskuserid";
import User from "../pages/User";
import Task from "../pages/Taskpage";
import NotificationsPage from "../pages/Notificationpage";
import Categorypage from "../pages/Categorypage";
import { useMediaQuery, useTheme } from "@mui/material";

function ProtectedLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div style={{ display: "flex", height: "100vh" ,}}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto",paddingLeft: isMobile ? "10px" : "290px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function Protectedroutes() {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Sidebar />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/user/:id" element={<Taskuserid />} />
        <Route path="/user" element={<User />} />
        <Route path="/task" element={<Task />} />
        <Route path="/category" element={<Categorypage/>} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
