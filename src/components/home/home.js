import React from 'react';
// import Navbar from '../Navbar/nav';
import './Home.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        if (token) {
            fetchBlogs();
        }
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/fetch_all_posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleBlogClick = (id) => {
        navigate(`/blog/${id}`);
    };

    if (!isAuthenticated) {
        return (
            <div className="home-container">
                <h1 className="home-title">Welcome to Our Blog!</h1>
                <p className="home-subtitle">Please <Link to="/login" className="login-link">login</Link> to view our amazing blog posts 🌟</p>
            </div>
        );
    }

    return (
        <div>
            <div className="home-container">
                <h1 className="home-title">Welcome to Our Blog!</h1>
                <p className="home-subtitle">Read the latest posts from our amazing writers 🌟</p>

                <div className="blogs-container">
                    {blogs.map((blog) => (
                        <div 
                            key={blog._id} 
                            className="blog-card"
                            onClick={() => handleBlogClick(blog._id)}
                        >
                            <h2 className="blog-title">{blog.title}</h2>
                            <p className="blog-description">{blog.content.substring(0, 150)}...</p>
                            <div className="blog-footer">
                                <span className="author">By {blog.author} &nbsp; &nbsp;</span>
                                <br />
                                <span className="date">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
