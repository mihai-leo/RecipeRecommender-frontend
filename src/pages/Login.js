import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      const { userId, role } = res.data;

      login({ userId, role });

      // Redirect based on role
      if (role === 'RECIPE_CREATOR') {
        navigate('/creator');
      } else if (role === 'HOME_COOK') {
        navigate('/find-recipes');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        padding: '30px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Login</h2>
      <input
        name="email"
        placeholder="Email"
        type="email"
        required
        value={form.email}
        onChange={handleChange}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '15px',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        required
        value={form.password}
        onChange={handleChange}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '20px',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px',
        }}
      >
        Login
      </button>
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px',
          }}
        >
          Don't have an account? Register here
        </button>
      </div>
    </form>
  );
};

export default Login;
