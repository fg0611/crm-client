// src/context/AuthContext.tsx

import { useState, useEffect, type ReactNode } from 'react';
import { type IUser } from '../interfaces/IUser';
import { AuthContext } from './authContextObject'; // <-- Import the context object

// Define la interfaz para el estado y las funciones del contexto
export interface AuthContextType {
    user: IUser | null;
    token: string | null;
    login: (newToken: string, userData: IUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// Define la interfaz para los props del proveedor
interface AuthProviderProps {
    children: ReactNode;
}

// El proveedor de contexto que encapsulará tu aplicación
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        // Carga el token del localStorage al inicio
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const login = (newToken: string, userData: IUser) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};