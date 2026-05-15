import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/authApi";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem("user")); }
        catch { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login(email, password);
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            }

        } catch (err) {
            const msg = err?.response?.data?.message || "Invalid credentials. Please try again.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await authApi.logout(token);
        } catch (_) {
            //  clear local state
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const clearError = useCallback(() => setError(null), []);

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, logout, clearError, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}