import React, { useState } from 'react'; // Import React and useState hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation after successful login/register
import backgroundImage from '../Image/background.jpg'; // Import background image for styling
import { toast, ToastContainer } from 'react-toastify'; // Import toast notification and container for success/error messages
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS for styling notifications
import axios from 'axios'; // Import axios for making HTTP requests

function AuthForm() {
  // State to store username, password, and whether the user is on login or registration form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // True means login form is shown, false for registration form
  const navigate = useNavigate(); // Hook to programmatically navigate to another route after successful login/register

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const endpoint = isLogin ? 'login' : 'register'; // Choose the appropriate API endpoint (login or register)

    try {
      // Send POST request to either login or register API depending on isLogin state
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, {
        username,
        password,
      });

      toast.success(res.data.message); // Show success toast if the request is successful

      // If login is successful, navigate to entry form with user ID
      if (isLogin) {
        const user = await axios.get(`http://localhost:5000/api/auth/users/${username}`); // Fetch user data by username
        const userId = user.data._id; // Extract user ID
        navigate(`/entryform/${userId}`); // Navigate to entry form page with user ID
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error'; // Get the error message from the response
      toast.error(errorMsg); // Show error toast if an error occurs
    }
  };

  return (
    <>
      <div style={{ ...styles.outerContainer, backgroundImage: `url(${backgroundImage})` }}>
        {/* Outer container with background image and styles */}
        <div style={styles.card}>
          {/* Card for form content */}
          <h2 style={styles.title}>{isLogin ? 'Welcome Back 👋' : 'Join Us 🚀'}</h2>
          {/* Title changes based on isLogin state */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Form for username, password, and submit */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Username"
              required
              style={styles.input}
            />
            {/* Username input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
              style={styles.input}
            />
            {/* Password input */}
            <button type="submit" style={styles.button}>
              {isLogin ? 'Login' : 'Register'}
            </button>
            {/* Submit button text changes based on isLogin state */}
          </form>

          <button onClick={() => setIsLogin(!isLogin)} style={styles.toggle}>
            {/* Button to toggle between login and register */}
            {isLogin ? 'New here? Register ✨' : 'Have an account? Login 🔐'}
          </button>
          {/* Text that changes based on isLogin state */}
        </div>

        <ToastContainer position="top-right" autoClose={3000} theme="colored" pauseOnHover />
        {/* Toast notifications container */}
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

// https://mern-auth-app-backend-j9eh.onrender.com 
