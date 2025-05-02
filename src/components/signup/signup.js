import React from 'react';
import './signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const handleSignup = async () => {
    try {
      console.log(user);
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Clear the form
        setUser({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
        });
        // Redirect to verification page
        navigate('/verify-email');
      } else {
        alert(data.message || 'Signup failed. Please try again.');
      }
      console.log(data);
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>Sign Up</h1>

        <input type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder="Username" />
        <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />
        <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
        <input type="password" value={user.confirmPassword} onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })} placeholder="Confirm Password" />
        <div className='role-container'>
          <label htmlFor="role">Role</label>
          <select name="role" id="role" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
            <option value="" selected>Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className='signup-button' onClick={handleSignup}>Sign Up</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Signup; 