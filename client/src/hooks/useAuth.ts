import { useSelector } from 'react-redux';
import { selectAuth, selectUser, selectToken, selectIsAuthenticated, selectIsLoading, selectError } from '@/redux/features/auth/authSlice';

export const useAuth = () => {
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  return {
    ...auth,
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
  };
}; 