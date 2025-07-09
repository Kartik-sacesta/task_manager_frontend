import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Loginpage";

const PublicRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                
            </Routes>
    </>
    );
};

export default PublicRoutes;