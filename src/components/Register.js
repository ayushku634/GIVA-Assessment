import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [message, setMessage] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('Submitting form...');

  if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
  }

  try {
      // Inform that the API request is about to happen
      setMessage('Sending request to server...');
      
      const response = await axios.post('http://localhost:5006/api/register', {
          email,
          username,
          password,
          adminKey: adminKeyInput
      });
      
      // If registration is successful, show all debug messages
      const { success, debugMessages } = response.data;
      if (success) {
          setMessage(`Registration successful! Debug trace:\n${debugMessages.join('\n')}`);
      }
  } catch (error) {
      console.error(error);  // Log the error details for debugging
      
      // If the request failed, show all debug messages from the backend
      if (error.response && error.response.data.debugMessages) {
          setMessage(`Error: ${error.response.data.debugMessages.join('\n')}`);
      } else {
          setMessage('Error registering. Please check your network or server.');
      }
  }
};

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <input type="text" placeholder="Admin Key (optional)" value={adminKeyInput} onChange={(e) => setAdminKeyInput(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;
