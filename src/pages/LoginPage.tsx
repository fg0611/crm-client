import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { type IUserForm } from '../interfaces/commonInterfaces'; // Importa la nueva interfaz IUserForm
import UserForm from '../components/UserForm';
import axios from 'axios';
import { envVars } from '../others/helpers';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

const handleLogin = async (data: IUserForm) => {
  try {
    // Formatear los datos para el formato x-www-form-urlencoded
      const formData = new URLSearchParams();
      console.log(data)
      formData.append('username', data.username);
      formData.append('password', data.password);
    // Llama a tu endpoint de login
    const response = await axios.post(envVars.apiUrl + '/token', formData);
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
        path={'/register'}
      />
    </div>
  );
};

export default LoginPage;