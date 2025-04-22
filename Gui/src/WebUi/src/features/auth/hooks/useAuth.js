import { useState } from "react";
import { login, logout } from "../api";
import { useAuthDispatch } from "../AuthContext";

export const useAuth = () => {
    const dispatch = useAuthDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const data = await login(username, password);
            dispatch({ type: "LOGIN", payload: { user: data.user } });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        setLoading(true);
        setError(null);

        try {
            await logout();
            dispatch({ type: "LOGOUT" });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loginUser,
        logoutUser,
        loading,
        error,
    };
};
