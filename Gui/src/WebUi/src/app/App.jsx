import "./App.css";
import { Route, Routes } from "react-router";
import { Outlet } from "react-router";

import Header from "@/features/header/components/Header";
import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryPage from "@/features/telemetry/pages/TelemetryPage";

function App() {
    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            <Header />

            <main className="flex-grow overflow-y-auto">
                <Outlet />
            </main>

            {/* <Routes>
                <Route index element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/telemetry" element={<TelemetryPage />} />
            </Routes> */}

            {/* <Footer /> */}
        </div>
    );
}

export default App;
