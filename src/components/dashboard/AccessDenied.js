import React from 'react';
import './AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="access-denied-container">
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <p>Please contact the administrator if you believe this is an error.</p>
    </div>
  );
};

export default AccessDenied; 