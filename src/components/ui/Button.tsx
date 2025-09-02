import { type FC, type ReactNode } from 'react';

// Define la interfaz para las props del botón
interface ButtonProps {
  children: ReactNode; // El contenido del botón (texto, icono, etc.)
  onClick?: () => void; // Función que se ejecuta al hacer clic
  type?: 'button' | 'submit' | 'reset'; // Tipo de botón
  disabled?: boolean; // Para deshabilitar el botón
  className?: string; // Para clases de estilo personalizadas
}

const Button: FC<ButtonProps> = ({ children, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
        ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
