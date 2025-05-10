import "./App.css";
import { Route, Routes } from "react-router";

import Header from "@/features/header/components/Header";
import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryPage from "@/features/telemetry/pages/TelemetryPage";

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route index element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/telemetry" element={<TelemetryPage />} />
            </Routes>

            {/* <Footer /> */}
        </>
    );
}

export default App;
