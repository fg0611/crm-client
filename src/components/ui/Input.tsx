import type { FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form';
import { cn } from '../../lib/utils'; // Asumiendo que tienes una utilidad para las clases

interface InputProps<T extends FieldValues> {
    hasLabel: boolean;
    label?: string;
    id: string;
    type: "text" | "email" | "password" | "number" | "checkbox"; // <-- Tipo de input
    placeholder?: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T> | null;
    stateKey: Path<T>;
}

const Input = <T extends FieldValues>({ hasLabel, label, id, type, placeholder, register, errors, stateKey }: InputProps<T>) => {
    const error = errors?.[stateKey];

    const isCheckbox = type === "checkbox";

    // Clases de Tailwind para el contenedor
    const containerClasses = cn(
        "w-full",
        {
            "flex flex-col space-y-2": !isCheckbox,
            "flex items-center space-x-2": isCheckbox,
        }
    );

    // Clases de Tailwind para el input
    const inputClasses = cn(
        {
            "w-full px-4 py-2 text-gray-300 bg-gray-700 border rounded-md focus:outline-none focus:ring-2": !isCheckbox,
            "form-checkbox h-4 w-4 text-primary-violet rounded": isCheckbox,
            "border-red-500 focus:ring-red-500": error && !isCheckbox,
            "border-gray-600 focus:ring-purple-500": !error && !isCheckbox,
        }
    );

    return (
        <div className={containerClasses}>
            {hasLabel && (
                <label htmlFor={id} className={cn("text-sm font-medium", { "text-gray-400": !isCheckbox })}>
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={inputClasses}
                placeholder={isCheckbox ? undefined : placeholder}
                {...register(stateKey)}
            />
            {error && !isCheckbox && (
                <p className="mt-1 text-xs text-red-500">
                    {error.message as string}
                </p>
            )}
        </div>
    );
};

export default Input;