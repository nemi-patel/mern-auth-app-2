import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../Image/background.jpg';

const baseURL = 'https://mern-auth-app-backend2.onrender.com';

function EntryForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', email: '' });
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/entries`);
      setEntries(res.data);
    } catch {
      toast.error('❌ Failed to fetch entries');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('All fields are required');

    try {
      if (editingId) {
        await axios.put(`${baseURL}/api/entries/${editingId}`, form);
        toast.success('✏️ Entry updated successfully!');
        setEditingId(null);
      } else {
        await axios.post(`${baseURL}/api/entries`, form);
        toast.success('✅ Entry saved successfully!');
      }
      setForm({ name: '', email: '' });
      await fetchEntries();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('⚠️ Email already exists!');
      } else {
        toast.error('❌ Failed to submit entry');
      }
    }
  };

  const handleEdit = (entry) => {
    setForm({ name: entry.name, email: entry.email });
    setEditingId(entry._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/entries/${id}`);
      setEntries(entries.filter((e) => e._id !== id));
      toast.success('🗑️ Entry deleted successfully!');
    } catch {
      toast.error('❌ Failed to delete entry');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`${baseURL}/api/auth/users/${id}`);
      toast.success('👋 Logged out and user deleted!');
      setTimeout(() => navigate('/'), 1000);
    } catch {
      toast.error('❌ Logout failed');
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          Logout
        </button>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '700px',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>
            📝 {editingId ? 'Edit Entry' : 'Submit Form'}
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                padding: '0.8rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                padding: '0.8rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                border: 'none',
                fontSize: '1rem',
              }}
            >
              {editingId ? 'Save Changes' : 'Submit Entry'}
            </button>
          </form>

          <h3 style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>
            📋 Submitted Entries
          </h3>

          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                minWidth: '400px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#e5e7eb' }}>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.8rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td style={{ padding: '0.8rem' }}>{entry.name}</td>
                    <td style={{ padding: '0.8rem' }}>{entry.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(entry)}
                          style={{
                            backgroundColor: '#ffba08',
                            padding: '0.4rem 0.8rem',
                            border: 'none',
                            borderRadius: '0.4rem',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          style={{
                            backgroundColor: '#ef4444',
                            padding: '0.4rem 0.8rem',
                            border: 'none',
                            borderRadius: '0.4rem',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" pauseOnHover />
    </>
  );
}

export default EntryForm;

