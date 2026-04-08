import './App.css';
import Login from './components/login/Login';
import Register from './components/register/Register';
import React from 'react';
import Dashboard from './components/dashboard/Dashboard';
import Home from './components/dashboard/Home';
import Invoices from './components/dashboard/Invoices';
import NewInvoice from './components/dashboard/NewInvoice';
import InvoiceMaker from './components/dashboard/InvoiceMaker';
import Profile from './components/dashboard/Profile';

import { createHashRouter, RouterProvider } from 'react-router-dom'; // ✅ CHANGE HERE

function App() {
  const myRouter = createHashRouter([   // ✅ CHANGE HERE
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/dashboard',
      element: <Dashboard />,
      children: [
        { path: '', element: <Home /> },
        { path: 'home', element: <Home /> },
        { path: 'invoices', element: <Invoices /> },
        { path: 'new-invoice', element: <NewInvoice /> },
        { path: 'invoice-make', element: <InvoiceMaker /> },
        { path: 'profile', element: <Profile /> }
      ]
    }
  ]);

  return (
    <div>
      <RouterProvider router={myRouter} />
    </div>
  );
}

export default App;
