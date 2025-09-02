// src/components/ui/Input.tsx

import type { FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form';
import { cn } from '../../lib/utils'; // Assuming you have a utility for class names

interface InputProps<T extends FieldValues> {
    hasLabel: boolean;
    label?: string;
    id: string;
    type: string;
    placeholder?: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T> | null;
    stateKey: Path<T>;
}

const Input = <T extends FieldValues>({ hasLabel, label, id, type, placeholder, register, errors, stateKey }: InputProps<T>) => {
    const error = errors?.[stateKey];

    return (
        <div className="flex flex-col space-y-2 w-full">
            {hasLabel && (
                <label htmlFor={id} className="text-sm font-medium text-gray-400">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={cn(
                    "w-full px-4 py-2 text-gray-300 bg-gray-700 border rounded-md focus:outline-none focus:ring-2",
                    error ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-purple-500"
                )}
                placeholder={placeholder}
                {...register(stateKey)}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error.message as string}
                </p>
            )}
        </div>
    );
};

export default Input;