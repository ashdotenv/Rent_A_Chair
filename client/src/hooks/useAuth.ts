import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectAuth, selectUser, selectToken, selectIsAuthenticated, selectIsLoading, selectError, logout } from '@/redux/features/auth/authSlice';
import { useLogoutMutation } from '@/redux/features/api/apiSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the server-side cookie
      await logoutApi().unwrap();
      
      // Clear the client-side state
      dispatch(logout());
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, clear the client-side state
      dispatch(logout());
      router.push('/login');
    }
  };

  return {
    ...auth,
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    logout: handleLogout,
    isLoggingOut,
  };
}; 