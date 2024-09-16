import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/sidebar';
import Main from './components/Main/Main';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import PaymentPage from './components/PaymentPage/PaymentPage';
import PaymentSuccessPage from './components/PaymentSuccessPage/PaymentSuccessPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<><Sidebar /><Main /></>} />
            <Route path="/payment" element={<PaymentPage />} />
	   <Route path="/payment-success" element={<PaymentSuccessPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

