import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // <-- import useNavigate
import api from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'HOME_COOK' });
  const navigate = useNavigate();  // <-- initialize navigate

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error during registration');
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
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Register</h2>
      <input
        name="name"
        placeholder="Name"
        required
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
        name="email"
        placeholder="Email"
        type="email"
        required
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
      <select
        name="role"
        onChange={handleChange}
        value={form.role}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '25px',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          cursor: 'pointer',
        }}
      >
        <option value="HOME_COOK">Home Cook</option>
        <option value="RECIPE_CREATOR">Recipe Creator</option>
      </select>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#28a745',
          color: 'white',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px',
        }}
      >
        Register
      </button>

      {/* Back to Login Button */}
      <button
        type="button"
        onClick={() => navigate('/login')}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Back to Login
      </button>
    </form>
  );
};

export default Register;
