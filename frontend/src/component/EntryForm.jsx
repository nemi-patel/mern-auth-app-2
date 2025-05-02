import React, { useEffect, useState } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for API requests
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import { useNavigate, useParams } from 'react-router-dom'; // Import routing hooks
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS for styling notifications
import backgroundImage from '../Image/background.jpg'; // Import background image

function EntryForm() {
  const { id } = useParams();  // Retrieve the user ID from the URL params
  const [form, setForm] = useState({ name: '', email: '' }); // State for form data (name and email)
  const [entries, setEntries] = useState([]); // State for storing list of submitted entries
  const [editingId, setEditingId] = useState(null); // State to track the entry being edited (if any)
  const navigate = useNavigate(); // Hook for navigating between routes

  useEffect(() => {
    fetchEntries(); // Fetch all entries on component mount
  }, []);

  // Fetch all entries from the backend
  const fetchEntries = async () => {
    const res = await axios.get('http://localhost:5000/api/entries');
    setEntries(res.data); // Set the entries in state
  };

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Update state with input values
  };

  // Handle form submission (both create and update)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!form.name || !form.email) return toast.error('All fields are required'); // Validation

    try {
      if (editingId) {
        // Update an existing entry
        await axios.put(`http://localhost:5000/api/entries/${editingId}`, form);
        toast.success('✏️ Entry updated successfully!');
        setEditingId(null); // Reset editing state
      } else {
        // Create a new entry
        await axios.post('http://localhost:5000/api/entries', form);
        toast.success('✅ Entry saved successfully!');
      }
      setForm({ name: '', email: '' }); // Reset the form
      await fetchEntries(); // Fetch updated entries list
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('⚠️ Email already exists!'); // Handle email conflict
      } else {
        toast.error('❌ Failed to submit entry'); // Handle general error
      }
    }
  };

  // Handle editing an existing entry
  const handleEdit = (entry) => {
    setForm({ name: entry.name, email: entry.email }); // Set form fields to the entry's values
    setEditingId(entry._id); // Set the entry ID to mark it as being edited
  };

  // Handle deleting an entry
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/entries/${id}`);
    setEntries(entries.filter(e => e._id !== id)); // Remove deleted entry from the state
    toast.success('🗑️ Entry deleted successfully!');
  };

  // Handle logout and delete the user data
  const handleLogout = async () => {
    try {
      // Delete user by ID from the backend
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      toast.success('👋 Logged out and user deleted!');
      
      // After a successful logout, redirect to the login page
      setTimeout(() => {
        navigate('/'); // Navigate to the login page
      }, 1000); // Redirect after 1 second
    } catch (err) {
      toast.error('❌ Logout failed'); // Handle logout error
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`, // Set background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh', // Full viewport height
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Logout button */}
        <button
          onClick={handleLogout} // Trigger logout and delete user
          style={{
            position: 'fixed', // Position it at the top-right corner
            top: '1rem',
            right: '1rem',
            backgroundColor: '#ef4444', // Red color
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 1000 // Ensure it stays above other elements
          }}
        >
          Logout
        </button>

        {/* Form container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)', // Light background for form
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          width: '50%', // 50% width of the screen
          maxWidth: '700px' // Max width for larger screens
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
            📝 {editingId ? 'Edit Entry' : 'Submit Form'} {/* Title changes based on editing state */}
          </h2>

          {/* Form to submit name and email */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange} // Update form state
              required
              style={{
                padding: '0.8rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '50%',
                margin: '0 auto'
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange} // Update form state
              required
              style={{
                padding: '0.8rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '50%',
                margin: '0 auto'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#4caf50', // Green button
                color: 'white',
                padding: '0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                border: 'none',
                fontSize: '1rem',
                width: '50%',
                margin: '0 auto'
              }}
            >
              {editingId ? 'Save Changes' : 'Submit Entry'} {/* Button text changes based on editing state */}
            </button>
          </form>

          {/* Display submitted entries */}
          <h3 style={{ textAlign: 'center', marginTop: '2rem' }}>📋 Submitted Entries</h3>

          {/* Table to show submitted entries */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#f9fafb'
          }}>
            <thead>
              <tr>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.8rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.8rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry._id}>
                  <td style={{ padding: '0.8rem' }}>{entry.name}</td>
                  <td style={{ padding: '0.8rem' }}>{entry.email}</td>
                  <td style={{ textAlign: 'center' }}>
                    {/* Edit and Delete buttons for each entry */}
                    <button
                      onClick={() => handleEdit(entry)} // Edit button
                      style={{
                        backgroundColor: '#ffba08',
                        padding: '0.4rem 0.8rem',
                        border: 'none',
                        borderRadius: '0.4rem',
                        marginRight: '0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)} // Delete button
                      style={{
                        backgroundColor: '#ef4444',
                        padding: '0.4rem 0.8rem',
                        border: 'none',
                        borderRadius: '0.4rem',
                        marginRight: '0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" pauseOnHover />
    </>
  );
}

export default EntryForm;

// https://mern-auth-app-backend-j9eh.onrender.com 
