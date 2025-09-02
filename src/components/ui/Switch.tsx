import { type FC } from 'react';
import { Controller, type FieldValues, type Control } from 'react-hook-form';
import { Switch as HBSwitch } from '@headlessui/react';
import { cn } from '../../lib/utils';

interface SwitchProps {
    id: string;
    control: Control<FieldValues>;
    stateKey: string;
}

const Switch: FC<SwitchProps> = ({ id, control, stateKey }) => {
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