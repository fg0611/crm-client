// src/context/authContextObject.ts

import { createContext } from 'react';
import { type AuthContextType } from './AuthContext'; // Import the type

export const AuthContext = createContext<AuthContextType | null>(null);