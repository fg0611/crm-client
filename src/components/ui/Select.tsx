// src/components/ui/Select.tsx

import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

// Define la interfaz para una opción del select
interface SelectOption {
    value: string;
    label: string;
}

// Define las props del componente Select como genéricas
interface SelectProps<TFormValues extends FieldValues> {
    hasLabel: boolean;
    label: string;
    id: string;
    options: SelectOption[];
    register: UseFormRegister<TFormValues>;
    stateKey: Path<TFormValues>;
}

// El componente se declara como genérico, permitiendo que TypeScript infiera el tipo
const Select = <TFormValues extends FieldValues>({ hasLabel, label, id, options, register, stateKey }: SelectProps<TFormValues>) => {
    return (
        <div className="flex flex-col space-y-2 w-full">
            {hasLabel && (
                <label htmlFor={id} className="text-sm font-medium text-gray-400">
                    {label}
                </label>
            )}
            <select
                id={id}
                className="w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register(stateKey)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;