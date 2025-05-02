import React from 'react'; // Import React
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import AuthForm from '../src/component/AuthForm'; // Import AuthForm component
import EntryForm from '../src/component/EntryForm'; // Import EntryForm component

function App() {
  return (
    <Router> 
      {/* Set up the Router for routing within the app */}
      <Routes>
        {/* Define the route for the AuthForm (login page) */}
        <Route path="/" element={<AuthForm />} />
        
        {/* Define the route for the EntryForm with a dynamic user ID */}
        {/* The user ID will be passed as a parameter in the URL */}
        <Route path="/entryform/:id" element={<EntryForm />} />
      </Routes>
    </Router>
  );
}

export default App;
