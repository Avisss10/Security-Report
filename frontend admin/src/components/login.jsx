import React, { useState } from 'react';
import '../styles/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ onLogin }) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nip || !password) {
      toast.error('NIP dan Password harus diisi');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        nip,
        password,
      });

      // Simpan user ke localStorage (atau context/global state kalau mau)
      const user = res.data.user;

      // Cek level user, hanya izinkan admin atau level 1
      if (user.nama_level !== 'admin' && user.id_level !== 1) {
        toast.error('Hanya admin atau level 1 yang dapat login.');
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));

      // Jalankan onLogin jika dikirim dari props
      if (onLogin) onLogin(user);

    // Redirect ke dashboard
    toast.success('Login berhasil');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      toast.error('NIP atau Password salah.');
    } else {
      toast.error('Server error, silakan coba lagi.');
    }
  }
};

  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="logo-circle">
          <svg className="shield-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="logo-text">
          <span>SECURITY</span>
          <span>REPORT</span>
        </div>
      </div>

      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Nip"
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Login;
