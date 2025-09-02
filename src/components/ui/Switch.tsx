// src/components/ui/Switch.tsx
import { Controller, type FieldValues, type Control, type Path } from 'react-hook-form';
import { Switch as HBSwitch } from '@headlessui/react';
import { cn } from '../../lib/utils'; // Asumiendo que tienes esta utilidad

// Interfaz genérica para las props del componente Switch
// TFormValues se extiende de FieldValues para asegurar la compatibilidad con react-hook-form
interface SwitchProps<TFormValues extends FieldValues> {
    id: string;
    control: Control<TFormValues>;
    stateKey: Path<TFormValues>;
}

// El componente se declara con el tipo genérico
const Switch = <TFormValues extends FieldValues>({ id, control, stateKey }: SwitchProps<TFormValues>) => {
    return (
        <Controller
            name={stateKey}
            control={control}
            render={({ field }) => (
                <HBSwitch
                    id={id}
                    checked={field.value}
                    onChange={field.onChange}
                    className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                        field.value ? 'bg-purple-600' : 'bg-gray-600'
                    )}
                >
                    <span
                        className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            field.value ? 'translate-x-6' : 'translate-x-1'
                        )}
                    />
                </HBSwitch>
            )}
        />
    );
};

export default Switch;