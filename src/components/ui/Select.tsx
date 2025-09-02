import { type FC } from 'react';
import type { FieldValues, UseFormRegister } from 'react-hook-form';

// Define la interfaz para una opción del select
interface SelectOption {
  value: string;
  label: string;
}

// Define las props del componente Select
interface SelectProps {
  hasLabel: boolean;
  label: string;
  id: string;
  options: SelectOption[];
  register: UseFormRegister<FieldValues>;
  stateKey: string;
}

const Select: FC<SelectProps> = ({ hasLabel, label, id, options, register, stateKey }) => {
  return (
    <div className="flex flex-col space-y-2">
      {hasLabel && <label htmlFor={id} className="text-sm font-medium text-gray-400">
        {label}
      </label>}
      <select
        id={id}
        className="w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        {...register(stateKey)}
      >
        <option value={options[0].value}>{options[0].label}</option>
        {options.slice(1).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
