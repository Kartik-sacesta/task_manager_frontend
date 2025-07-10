import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardPage from "../components/Sidebar";
import Taskuserid from "../pages/Taskuserid";
import User from "../components/User";
import Task from "../pages/Taskpage";
import NotificationsPage from "../pages/Notificationpage";

function ProtectedLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function Protectedroutes() {
  return (
   
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/user/:id" element={<Taskuserid />} />
          <Route path="/user" element={<User />} />
            <Route path="/task" element={<Task />} />
            <Route path="/notification" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
   
  );
}
