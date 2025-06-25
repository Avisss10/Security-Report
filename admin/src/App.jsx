import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Content from './components/dashboard/content';
import Security from './components/security/security';
import Cabang from './components/cabang/cabang';
import Login from './components/login';
import Archive from './components/archive/Archive';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('user');
  });

  // Cek apakah user sudah login saat pertama kali render
  useEffect(() => {
    // Tidak perlu clear localStorage di sini!
    setIsAuthenticated(!!localStorage.getItem('user'));
  }, []);

  // Simpan data user ke localStorage saat login
  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  // Hapus data user saat logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Komponen layout dashboard dengan sidebar
  const DashboardLayout = ({ children }) => (
    <div className="dashboard">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard--content">{children}</div>
    </div>
  );

  // Route yang hanya bisa diakses jika login
  const ProtectedRoute = ({ element }) => {
    const user = localStorage.getItem('user');
    return user ? element : <Navigate to="/login" />;
  };

  // Komponen logout yang langsung men-trigger logout
  const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
      handleLogout();
      navigate('/login');
    }, []);

    return null;
  };

  return (
    <Router>
      <Routes>
        {/* Default route akan redirect ke /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Dashboard (Home) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<DashboardLayout><Content /></DashboardLayout>} />
          }
        />

        {/* Security Management */}
        <Route
          path="/security"
          element={
            <ProtectedRoute element={<DashboardLayout><Security /></DashboardLayout>} />
          }
        />

        {/* Cabang Management */}
        <Route
          path="/cabang"
          element={
            <ProtectedRoute element={<DashboardLayout><Cabang /></DashboardLayout>} />
          }
        />

        {/* Arsip Laporan */}
        <Route
          path="/archive"
          element={
            <ProtectedRoute element={<DashboardLayout><Archive /></DashboardLayout>} />
          }
        />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />
          
        {/* Catch all route → redirect ke login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
