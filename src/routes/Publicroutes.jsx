import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import LoginPage from "../pages/Loginpage";

function PublicLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <LoginPage />
      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

const PublicRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default PublicRoutes;
