import "./App.css";
import LoginPage from "./pages/Loginpage";
import { ToastContainer } from "react-toastify";
import Publicroutes from "./routes/Publicroutes";
import Protectedroutes from "./routes/Protectedroutes";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [authorized, setauthorized] = useState(false);
  const token = localStorage.getItem("authtoken");

  const tokenvalidate = async () => {
    console.log("bdhdbhbfh");
    try {
      const res = await axios.post("http://localhost:5000/user/me", { token });
      console.log(res);
      const userdata = { role: res.data.roletitle, username: res.data.username };
      localStorage.setItem("userdata", JSON.stringify(userdata));
      
      setauthorized(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    tokenvalidate();
  },[]);

  return (
    <>
      {authorized ? (
        <>
          <Protectedroutes />
        </>
      ) : (
        <>
          {" "}
          <Publicroutes />{" "}
        </>
      )}
    </>
  );
}

export default App;
