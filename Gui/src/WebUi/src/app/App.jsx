import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { AuthProvider } from "@/features/auth/AuthContext";

import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryDashboard from "@/features/telemetry/pages/TelemetryPage";
import TelemetryGUI from "../features/telemetry/components/gui";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route index element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/dashboard" element={<TelemetryGUI />} />

                    <Route path="/telemetry" element={<TelemetryDashboard />} />
                </Routes>
            </Router>
        </AuthProvider>
        // <div>
        //   <h1>Welcome to React + Vite</h1>
        // </div>
    );
}

export default App;
