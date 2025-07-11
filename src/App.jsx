import "./App.css";
import LoginPage from "./pages/Loginpage";
import { ToastContainer } from "react-toastify";
import Publicroutes from "./routes/Publicroutes";
import Protectedroutes from "./routes/Protectedroutes";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

function App() {
  const [authorized, setauthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const tokenvalidate = async () => {
    const token = localStorage.getItem("authtoken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/user/me", { token });
      const userdata = {
        role: res.data.roletitle,
        username: res.data.username,
      };
      localStorage.setItem("userdata", JSON.stringify(userdata));
      setauthorized(true);
    } catch (e) {
      console.log(e);
      localStorage.removeItem("authtoken");
      localStorage.removeItem("userdata");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tokenvalidate();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        {authorized ? (
          <>
            <Protectedroutes />
          </>
        ) : (
          <>
            <Publicroutes />
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
