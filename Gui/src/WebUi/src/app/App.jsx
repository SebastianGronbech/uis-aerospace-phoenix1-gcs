import "./App.css";
import { Route, Routes } from "react-router";

import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryDashboard from "../features/telemetry/pages/TelemetryPage";

function App() {
    return (
        <>
            {/* <Header /> */}

            <Routes>
                <Route index element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/telemetry" element={<TelemetryDashboard />} />
            </Routes>

            {/* <Footer /> */}
        </>
    );
}

export default App;
