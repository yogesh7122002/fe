import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Blog App
                </Link>

                <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                    ☰
                </button>

                <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        Home
                    </Link>
                    
                    {token ? (
                        <>
                            <Link to="/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                Profile
                            </Link>
                            {role === 'admin' && (
                                <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    Admin
                                </Link>
                            )}
                            <div className="profile-dropdown">
                                <div className="profile-icon" onClick={toggleDropdown}>
                                    {localStorage.getItem('username')?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
                                    <div className="dropdown-item" onClick={() => {
                                        navigate('/profile');
                                        setIsDropdownOpen(false);
                                        setIsMobileMenuOpen(false);
                                    }}>
                                        Profile
                                    </div>
                                    <div className="dropdown-item logout" onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}>
                                        Logout
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/signup" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
