import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { type IUserForm } from '../interfaces/IUser'; // Importa la nueva interfaz IUserForm
import UserForm from '../components/UserForm';
import axios from 'axios';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

const handleLogin = async (data: IUserForm) => {
  try {
    // Formatear los datos para el formato x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);
    // Llama a tu endpoint de login
    const response = await axios.post('http://127.0.0.1:8000/token', formData);
    const { access_token: token, user } = response.data;

    // Llama a tu función de login del contexto con los datos reales
    login(token, user);
    
    // Redirige al usuario
    navigate('/', { replace: true });
  } catch (error) {
    // Maneja los errores (por ejemplo, credenciales incorrectas)
    console.error('Error al iniciar sesión:', error);
  }
};

  return (
    <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: 'var(--color-dark-background)' }}>
      <UserForm
        formTitle='Iniciar Sesión'
        buttonText='Iniciar sesión'
        onSubmit={handleLogin} // Pasamos la función actualizada al componente
      />
    </div>
  );
};

export default LoginPage;