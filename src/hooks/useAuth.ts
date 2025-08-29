// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../context/authContextObject'; // <-- Import the context object
import { type AuthContextType } from '../context/AuthContext'; // <-- Import the type

// Hook personalizado para acceder fácilmente al contexto de autenticación
export const useAuth = () => {
    const context = useContext<AuthContextType | null>(AuthContext);

    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};