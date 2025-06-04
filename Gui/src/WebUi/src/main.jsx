import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "./app";
import { AuthProvider } from "@/features/auth/AuthContext";

import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryPage from "@/features/telemetry/pages/TelemetryPage";
import EngineControlPage from "@/features/engine_control/pages/EngineControlPage";
import FlightEstimatorPage from "@/features/flight_estimator/pages/FlightEstimatorPage";
import DashboardPage from "@/features/Dashboard/pages/DashboardPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <App />
            </AuthProvider>
        ),

        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            
            {
                path: "/telemetry",
                element: <TelemetryPage />,
            },
            {
                path: "/engine-control",
                element: <EngineControlPage />,
            },
            {
                path: "/flight-estimator",
                element: <FlightEstimatorPage />,
            },
           
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
