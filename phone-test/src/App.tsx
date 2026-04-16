import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { Tractor } from '@aircall/tractor';
import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthProvider } from './hooks/useAuth';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem('access_token');
  let token = null;
  try {
    token = accessToken ? JSON.parse(accessToken) : null;
  } catch {
    token = accessToken;
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        const refreshToken = localStorage.getItem('refresh_token');
        let token = null;
        try {
          token = refreshToken ? JSON.parse(refreshToken) : null;
        } catch {
          token = refreshToken;
        }
        if (token) {
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${token}`
            }
          });
          return forward(operation);
        }
      }
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/login" element={<LoginPage />} />
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/calls" element={<ProtectedLayout />}>
        <Route index element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <GlobalAppStyle />
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
