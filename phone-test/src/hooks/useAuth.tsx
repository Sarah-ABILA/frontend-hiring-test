import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

const AuthContext = createContext({
  login: ({}: any) => {},
  logout: () => {},
  user: null as any
});

export const AuthProvider = () => {
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [storedUser, setStoredUser] = useLocalStorage('user', null);
  const [user, setUser] = useState<any>(storedUser);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  useEffect(() => {
    if (storedUser) setUser(storedUser);
  }, []);

  const login = ({ username, password }: any) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setStoredUser(user);
        setUser(user);
        navigate('/calls');
      }
    });
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setStoredUser(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = useMemo(() => {
    return { login, logout, user };
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
