const apiUrl = import.meta.env.VITE_API_URL;

export const login = async (username, password) => {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
};

export const logout = async () => {
    await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
};
