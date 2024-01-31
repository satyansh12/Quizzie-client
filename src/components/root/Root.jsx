// src/Root.jsx
import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import SideNavigation from "../navigation/SideNavigation";
import styles from "./Root.module.css"; // Assume you've created a CSS module for Root-specific styles

/**
 * Root.jsx acts as the main layout component wrapping around the authenticated part of the application.
 * It includes a navigation sidebar and renders child routes based on authentication status.
 */
const Root = () => {
    // Example check for authentication status
    const isAuthenticated = localStorage.getItem('jwt'); // This should be replaced with a more secure check
    // If not authenticated, redirect to the register route
    if (!isAuthenticated) {
        return <Navigate to="/register" replace/>;
    }
    // If authenticated, proceed to render the Root component normally
    return (
        <div className={styles.mainContainer}>
            <SideNavigation/>
            <div className={styles.subContainer}>
                <Outlet/> {/* This will render the nested routes */}
            </div>
        </div>
    );
};

export default Root;
