import React from 'react';
import { Link } from 'react-router-dom';
import './VerificationPage.css';

const VerificationPage = () => {
  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1>Verify Your Email</h1>
        <p className="verification-message">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        <div className="verification-actions">
          <Link to="/login" className="login-link">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage; 