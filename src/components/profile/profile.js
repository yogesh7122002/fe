import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({          
        username: '',
        email: '',
        role: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const get_user = useCallback(async () => {
        try {
            const email = localStorage.getItem('email');
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/get_user/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('email');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUser({
                username: data.username,
                email: data.email,
                role: data.role
            });
        } catch (err) {
            setError('Failed to load user data');
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        get_user();
    }, [get_user]);

    if (loading) {
        return <div className="profile-container loading">Loading...</div>;
    }

    if (error) {
        return <div className="profile-container error">{error}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <h1>{user.username}</h1>
            </div>
            <div className="profile-info">
                <p data-label="Username">{user.username}</p>
                <p data-label="Email">{user.email}</p>
                <p data-label="Role">{user.role}</p>
            </div>
        </div>
    );
};

export default Profile;

