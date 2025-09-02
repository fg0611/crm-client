import { useForm } from 'react-hook-form';
import { type IUserForm } from '../interfaces/commonInterfaces';

// ... (interface definitions are fine)
interface UserFormProps {
    formTitle: string;
    buttonText: string;
    onSubmit: (data: IUserForm) => void;
}

const UserForm = ({ formTitle, buttonText, onSubmit }: UserFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<IUserForm>();

    return (
        <div className='w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg' style={{ backgroundColor: 'var(--color-lighter-background)' }}>
            <h2 className='text-center text-3xl font-bold' style={{ color: 'var(--color-light-text)' }}>{formTitle}</h2>
            <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
                <div className='rounded-md shadow-sm -space-y-px'>
                    {/* Usuario/Username Input */}
                    <div>
                        <input
                            id='username'
                            name='username' // Recommended for better HTML semantics
                            type='text' // Use 'text' for username field
                            autoComplete='username' // Use 'username' for username autofill
                            required
                            className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:z-10 sm:text-sm rounded-t-md'
                            style={{
                                color: 'var(--color-light-text)',
                                backgroundColor: 'var(--color-lighter-background)'
                            }}
                            placeholder='Usuario'
                            {...register('username', { required: 'El usuario es requerido' })}
                        />
                        {errors.username && <p className='mt-2 text-sm' style={{ color: 'var(--color-danger-red)' }}>{errors.username.message}</p>}
                    </div>
                    {/* Contraseña/Password Input */}
                    <div>
                        <input
                            id='password'
                            name='password' // Recommended for better HTML semantics
                            type='password'
                            autoComplete='current-password'
                            required
                            className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 rounded-b-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm'
                            style={{
                                color: 'var(--color-light-text)',
                                backgroundColor: 'var(--color-lighter-background)'
                            }}
                            placeholder='Contraseña'
                            {...register('password', { required: 'La contraseña es requerida' })}
                        />
                        {errors.password && <p className='mt-2 text-sm' style={{ color: 'var(--color-danger-red)' }}>{errors.password.message}</p>}
                    </div>
                </div>
                <div>
                    <button
                        type='submit'
                        className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryViolet'
                        style={{ backgroundColor: 'var(--color-primary-violet)' }}
                    >
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;