import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

// Define las props del componente, ahora genéricas
interface InputProps<T extends FieldValues = FieldValues> {
  hasLabel: boolean;
  label: string;
  id: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  stateKey: Path<T>;
}

const Input = <T extends FieldValues = FieldValues>({ hasLabel, label, id, type, placeholder, register, errors, stateKey }: InputProps<T>) => {
  return (
    <div className="flex flex-col space-y-2">
      {hasLabel && <label htmlFor={id} className="text-sm font-medium text-gray-400">
        {label}
      </label>}
      <input
        id={id}
        type={type}
        className="w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder={placeholder}
        {...register(stateKey)}
      />
      {errors && errors[stateKey] && (
        <p className="mt-1 text-xs text-red-500">{errors[stateKey].message}</p>
      )}
    </div>
  );
};

export default Input;
