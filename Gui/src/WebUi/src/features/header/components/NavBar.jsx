import React from "react";
import { NavLink, useLocation } from "react-router";

function NavBar() {
    const location = useLocation();

    const navItems = [
        { path: "/telemetry", label: "Telemetry" },
        { path: "/engine-control", label: "Engine Control" },
        { path: "/flight-estimator", label: "Flight Estimator" },
        { path: "/black-box", label: "Black Box" },
    ];

    return (
        <nav className="flex-1 justify-center items-center flex space-x-6">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isActive
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        }`
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}

export default NavBar;
