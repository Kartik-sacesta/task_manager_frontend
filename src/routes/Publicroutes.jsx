import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import LoginPage from "../pages/Loginpage";
import { Box, Button, Grid } from "@mui/material";
import Adminloginpage from "../pages/Adminloginpage";
import { useNavigate } from "react-router-dom";
import Commonskeleton from "../skeleton/Commonskeleton";
function PublicLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

function Mainloginpage() {
  const navigate = useNavigate();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: "column",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Button
          variant="contained"
          color="#111827"
          sx={{
            minWidth: "150px",
            py: 1.5,
            fontSize: "1.1rem",
            backgroundColor: "#111827",
            color: "#fff",
          }}
          onClick={() => {
            navigate("/adminlogin");
          }}
        >
          Admin login
        </Button>
        <Button
          variant="outlined"
          color="#111827"
          sx={{
            minWidth: "150px",
            py: 1.5,
            fontSize: "1.1rem",
            Color: "#111827",
            backgroundColor: "#fff",
          }}
          onClick={() => {
            navigate("/userlogin");
          }}
        >
          User Login
        </Button>
      </Box>
    </Grid>
  );
}

const PublicRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Mainloginpage />} />
          <Route path="/userlogin" element={<LoginPage />} />
          <Route path="/adminlogin" element={<Adminloginpage />} />
        </Route>
      </Routes>
    </>
  );
};

export default PublicRoutes;
