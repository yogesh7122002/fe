import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetails.css';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch post details');
                }

                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError('Failed to load post details');
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id, navigate]);

    if (loading) {
        return <div className="blog-details-container loading">Loading...</div>;
    }

    if (error) {
        return <div className="blog-details-container error">{error}</div>;
    }

    if (!post) {
        return <div className="blog-details-container">Post not found</div>;
    }

    return (
        <div className="blog-details-container">
            <div className="blog-details-card">
                <div className="blog-header">
                    <h1>{post.title}</h1>
                    <div className="blog-meta">
                        <span className="author">By {post.author}</span>
                        <span className="date">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
                <div className="blog-content">
                    <p className="content">{post.content}</p>
                </div>
                <div className="blog-footer">
                    <button onClick={() => navigate('/home')} className="back-button">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails; 