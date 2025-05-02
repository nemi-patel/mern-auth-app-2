import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../Image/background.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const BASE_URL = 'https://mern-auth-app-backend2.onrender.com/api/auth';

function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await axios.post(`${BASE_URL}/${endpoint}`, {
        username,
        password,
      });

      toast.success(res.data.message);

      if (isLogin) {
        const user = await axios.get(`${BASE_URL}/users/${username}`);
        const userId = user.data._id;
        navigate(`/entryform/${userId}`);
      } else {
        // If registration is successful, redirect to login page
        toast.success('Registration successful! Please login.');
        setIsLogin(true);  // Switch to the login form after registration
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      toast.error(errorMsg);
    }
  };

  return (
    <>
      <div style={{ ...styles.outerContainer, backgroundImage: `url(${backgroundImage})` }}>
        <div style={styles.card}>
          <h2 style={styles.title}>{isLogin ? 'Welcome Back 👋' : 'Join Us 🚀'}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Username"
              required
              style={styles.input}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} style={styles.toggle}>
            {isLogin ? 'New here? Register ✨' : 'Have an account? Login 🔐'}
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" pauseOnHover />
      </div>
    </>
  );
}

const styles = {
  outerContainer: {
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    backdropFilter: 'blur(6px)',
    overflow: 'hidden',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '2rem',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
    color: '#fff',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '2rem',
    fontWeight: '600',
    color: '#333',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.8rem',
    borderRadius: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
  },
  toggle: {
    marginTop: '1rem',
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'underline',
  },
};

export default AuthForm;
