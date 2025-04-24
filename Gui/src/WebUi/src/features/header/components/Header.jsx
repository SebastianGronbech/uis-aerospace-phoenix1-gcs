import React, { useState, useEffect } from "react";
// import logo from "@/assets/logo.png";
import logo from "@/assets/phoenix_logo.png";

const Header = () => {
    // const logo =
    //     "https://images.squarespace-cdn.com/content/v1/6336b00a780c950d84d016e8/6b377870-4fd0-42a4-9bae-edce7074698f/uisaerospacelogo.png?format=1500w";
    const [theme, setTheme] = useState(
        () =>
            localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light")
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <header className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center">
                <img src={logo} alt="App Logo" className="h-8 w-auto mr-3" />
                <div className="text-gray-800 dark:text-white text-lg font-bold">
                    Phoenix
                </div>
            </div>

            {/* NavBar */}

            <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"
                aria-label={
                    theme === "light"
                        ? "Switch to Dark Mode"
                        : "Switch to Light Mode"
                }
            >
                {theme === "dark" ? (
                    <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-5 h-5 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>
        </header>
    );
};

export default Header;
