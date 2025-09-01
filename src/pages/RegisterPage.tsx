import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type IUserForm } from '../interfaces/IUser';
import UserForm from '../components/UserForm';
import axios from 'axios';

const RegisterPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: IUserForm) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/register', {
        username: data.username,
        password: data.password,
      });

      if (response.status === 200) { // 201 Created
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      // Puedes manejar el error aquí (ej. mostrar un mensaje de error en la UI)
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: 'var(--color-dark-background)' }}>
      {isRegistered ? (
        <div className='w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg text-center' style={{ backgroundColor: 'var(--color-lighter-background)' }}>
          <h2 className='text-3xl font-bold' style={{ color: 'var(--color-light-text)' }}>¡Registro Exitoso!</h2>
          <p className='text-lg' style={{ color: 'var(--color-text-secondary)' }}>Solicita activación al Admin</p>
          <button
            onClick={goToLogin}
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryViolet'
            style={{ backgroundColor: 'var(--color-primary-violet)' }}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      ) : (
        <UserForm
          formTitle='Registrarme'
          buttonText='Registrarme'
          onSubmit={handleRegister}
        />
      )}
    </div>
  );
};

export default RegisterPage;
