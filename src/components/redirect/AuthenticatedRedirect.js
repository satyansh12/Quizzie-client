// src/components/AuthenticatedRedirect.js

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AuthenticatedRedirect.js is a utility component for redirecting users based on their authentication status.
 * It's used to protect routes that require authentication, redirecting unauthenticated users to the login page.
 */
const AuthenticatedRedirect = () => {
    const isAuthenticated = localStorage.getItem('jwt'); // Check for authentication token
    return isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/register" />;
};

export default AuthenticatedRedirect;
