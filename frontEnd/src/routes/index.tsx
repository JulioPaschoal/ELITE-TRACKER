import { createBrowserRouter } from 'react-router-dom';

import { Habits } from '../screens/habits';
import { Login } from '../screens/login';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Habits />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
