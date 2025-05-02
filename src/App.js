import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/login';
import Navbar from './components/Navbar/nav.js';
import Signup from './components/signup/signup';
import Profile from './components/profile/profile';
import Home from './components/home/home';
import AdminDashboard from './components/dashboard/admin_dash';
import BlogDetails from './components/blog/BlogDetails';
import VerificationPage from './components/auth/VerificationPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/verify-email" element={<VerificationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
