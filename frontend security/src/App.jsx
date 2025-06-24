import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import Profile from './pages/Profile';
import Login from './pages/Login'; 

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('id_user');
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderRoutes = ['/', '/create', '/login'];

  const shouldHideHeader = hideHeaderRoutes.some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    const user = localStorage.getItem('id_user');
    if (!user && location.pathname === '/') {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!shouldHideHeader && <Header />}
      <main className={shouldHideHeader ? '' : 'pt-28'}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />

      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
