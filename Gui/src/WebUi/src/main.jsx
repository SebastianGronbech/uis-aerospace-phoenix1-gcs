import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "./app";
import { AuthProvider } from "@/features/auth/AuthContext";

import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryPage from "@/features/telemetry/pages/TelemetryPage";
import EngineControl from "@/features/engine_control/pages/EngineControl";
import FlightEstimator from "@/features/flight_estimator/pages/FlightEstimator";

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
                element: <LoginPage />,
            },
            {
                path: "/telemetry",
                element: <TelemetryPage />,
            },
            {
                path: "/engine-control",
                element: <EngineControl />,
            },
            {
                path: "/flight-estimator",
                element: <FlightEstimator />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
