import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { AuthProvider } from "@/features/auth/AuthContext";

import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryGUI from "../features/telemetry/components/gui";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route index element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/dashboard" element={<TelemetryGUI />} />
                </Routes>
            </Router>
        </AuthProvider>
        // <div>
        //   <h1>Welcome to React + Vite</h1>
        // </div>
    );
}

export default App;
