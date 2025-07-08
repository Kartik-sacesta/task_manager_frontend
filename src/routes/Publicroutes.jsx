import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Loginpage";

const PublicRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default PublicRoutes;