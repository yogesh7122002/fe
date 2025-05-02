import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AccessDenied from './AccessDenied';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [updateForm, setUpdateForm] = useState({ title: '', content: '' });

  // Check for valid token and admin role
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'admin') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        return false;
      }
      return true;
    };

    if (!checkAuth()) {
      return;
    }

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/fetch_all_posts', {
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
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  // If loading, show loading state
  if (isLoading) {
    return <div className="admin-container">Loading...</div>;
  }

  // If not admin, show access denied
  if (localStorage.getItem('role') !== 'admin') {
    return <AccessDenied />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPost.title.trim() === '' || newPost.content.trim() === '' || newPost.author.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/create_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });
      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const createdPost = await response.json();
      setPosts([createdPost, ...posts]);
      setNewPost({ title: '', content: '', author: '' });
      setError('');
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    }
  };

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the post: "${title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Deleting post with ID:', id);
      const response = await fetch(`http://localhost:5000/delete_post/${id}`, {
        method: 'DELETE',
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
        throw new Error('Failed to delete post');
      }

    // Refetch all After I USer delete the post
      const fetchResponse = await fetch('http://localhost:5000/fetch_all_posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch updated posts');
      }

      const updatedPosts = await fetchResponse.json();
      setPosts(updatedPosts);
      setError('');
    } catch (err) {
      setError('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
    }
  };

  const handleUpdatePost = async (id, title) => {
    const post = posts.find(p => p._id === id);
    if (post) {
      setSelectedPost(post);
      setUpdateForm({
        title: post.title,
        content: post.content
      });
      setShowUpdateModal(true);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/update_post/${selectedPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      // Refetch all posts after successful update
      const fetchResponse = await fetch('http://localhost:5000/fetch_all_posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch updated posts');
      }

      const updatedPosts = await fetchResponse.json();
      setPosts(updatedPosts);
      setShowUpdateModal(false);
      setError('');
    } catch (err) {
      setError('Failed to update post. Please try again.');
      console.error('Error updating post:', err);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="admin-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      {error && <div className="error-message">{error}</div>}

      {/* Update Post Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Post</h2>
            <form onSubmit={handleUpdateSubmit} className="update-form">
              <input
                type="text"
                name="title"
                value={updateForm.title}
                onChange={handleUpdateChange}
                placeholder="Post Title"
                required
              />
              <textarea
                name="content"
                value={updateForm.content}
                onChange={handleUpdateChange}
                placeholder="Post Content"
                rows="4"
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowUpdateModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="update-submit-button">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Post Form */}
      <div className="create-post">
        <h2>Create New Post</h2>
        <form onSubmit={handleCreatePost} className="create-form">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={newPost.title}
            onChange={handleInputChange}
          />
          <textarea
            name="content"
            placeholder="Post Content"
            value={newPost.content}
            onChange={handleInputChange}
            rows="4"
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={newPost.author}
            onChange={handleInputChange}
          />
          <button type="submit" className="create-button">Create Post</button>
        </form>
      </div>

      {/* List of Posts */}
      <div className="posts-section">
        <h2>All Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <div className="posts-list">
            {posts.map(post => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="post-actions">
                  <button 
                    onClick={() => handleUpdatePost(post._id, post.title)} 
                    className="Update-button"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post._id, post.title)} 
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
