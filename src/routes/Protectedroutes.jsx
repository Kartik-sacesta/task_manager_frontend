import { Routes, Route, BrowserRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Protectedroutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<Sidebar/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Protectedroutes;