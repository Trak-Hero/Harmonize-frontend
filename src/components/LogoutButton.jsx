import { useAuthStore } from '../state/authStore';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ className = "", children = "Log Out" }) {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); 
  };

  return (
    <button 
      onClick={handleLogout}
      className={`${className}`}
    >
      {children}
    </button>
  );
}

export function useLogout() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  return async () => {
    await logout();
    navigate('/');
  };
}