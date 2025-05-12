import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "./app";
import { AuthProvider } from "@/features/auth/AuthContext";

import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryPage from "@/features/telemetry/pages/TelemetryPage";

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
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
