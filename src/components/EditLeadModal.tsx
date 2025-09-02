import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { XCircle, Save } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Switch from './ui/Switch';
import { statusOptions } from '../others/options';
import type { ILeadUpdate } from '../interfaces/commonInterfaces';

interface EditLeadModalProps {
    lead: ILeadUpdate | null;
    onSave: (updatedData: { id: string, name: string; is_active: boolean; status: string }) => void;
    onCancel: () => void;
}

const EditLeadModal = ({ lead, onSave, onCancel }: EditLeadModalProps) => {
    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<ILeadUpdate>();

    useEffect(() => {
        if (lead) {
            reset({
                name: lead.name,
                is_active: lead.is_active,
                status: lead.status,
            });
        }
    }, [lead, reset]);

    const onSubmit: SubmitHandler<ILeadUpdate> = (data) => {
        onSave(data);
    };

    if (!lead) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
            <div className='relative w-full max-w-lg p-6 rounded-lg shadow-xl' style={{ backgroundColor: 'var(--color-lighter-background)', color: 'var(--color-light-text)' }}>
                <button
                    onClick={onCancel}
                    className='absolute top-4 right-4 text-gray-400 hover:text-gray-200'
                    aria-label='Cerrar'
                >
                    <XCircle size={24} />
                </button>
                <h2 className='text-2xl font-bold mb-4'>Editar Lead</h2>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <p className='text-sm text-gray-400 mb-1'>ID del Lead:</p>
                        <p className='font-mono p-2 rounded-md border border-gray-600 bg-gray-700'>{lead.id}</p>
                    </div>

                    <Input
                        hasLabel={true}
                        label='Nombre'
                        id='edit-name'
                        type='text'
                        placeholder='Nombre'
                        register={register}
                        errors={errors}
                        stateKey='name'
                    />

                    <div className='flex items-center justify-between'>
                        <label className='text-sm font-medium'>Estado Activo</label>
                        <Switch
                            id='edit-is_active'
                            stateKey='is_active'
                            control={control}
                        />
                    </div>

                    <Select
                        hasLabel={true}
                        label='Estado'
                        id='edit-status'
                        options={statusOptions}
                        register={register}
                        stateKey='status'
                    />

                    <div className='flex justify-end gap-2 pt-4'>
                        <Button type='button' onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button type='submit' className='flex items-center gap-2'>
                            <Save size={18} /> Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLeadModal;