import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const handleLogin = async () => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(data.token);
    if(data.token){
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', data.role);
      setUser({
        email: '',
        password: '',
      });
      navigate('/home');
    }else{
      alert('login failed');
    }
  };
  return <div className="login-container">
    <div className="login-form">
      <h1>Login</h1>
      <input type="text" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />
      <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  </div>;
};

export default Login;