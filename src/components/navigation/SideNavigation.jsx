// src/components/SideNavigation.jsx
import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import styles from './SideNavigation.module.css';
import axios from "axios"; // Assume you have extracted the relevant CSS

/**
 * SideNavigation.jsx provides a sidebar navigation component for the application.
 * It enables navigation between different sections such as dashboard, analytics, and quiz creation.
 */
const SideNavigation = () => {
    const [activeScreen, setActiveScreen] = useState("dashboard");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const jwtToken = localStorage.getItem("jwt");
    // console.log("jwt from local storage:", jwtToken);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/api/logout`, null, {
                withCredentials: true,
            })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.removeItem("jwt"); // Remove JWT from local storage
                    navigate("/register");
                    setIsLoggedIn(false);
                }
            })
            .catch((error) => {
                console.error("Error during logout:", error);
            });
    };

    axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/isloggedin`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
        .then((response) => {
            if (response.data.isLoggedIn) {
                setEmail(response.data.user.email);
                setIsLoggedIn(response.data.isLoggedIn);
            } else {
                console.log("User is not logged in");
            }
        })
        .catch((error) => {
            console.error("An error occurred:", error);
        });
    const location = useLocation();
    console.log("location.pathname ",  location.pathname);
    return (
        <div className={styles.sideBar}>
            <Link to="/dashboard" style={{textDecoration: "none"}}>
                <div className={styles.logo}>QUIZZIE</div>
            </Link>
            <div className={styles.modesContainer}>
                <button className={`${styles.modeBtn} ${location.pathname === "/dashboard" ? styles.activeScreen : ""}`}
                        onClick={() => navigate("/dashboard")}>
                    Dashboard
                </button>
                <button className={`${styles.modeBtn} ${location.pathname === "/analytics" ? styles.activeScreen : ""}`}
                        onClick={() => navigate("/analytics")}>
                    Analytics
                </button>
                <button
                    className={`${styles.modeBtn} ${location.pathname === "/createQuiz" ? styles.activeScreen : ""}`}
                    onClick={() => navigate("/createQuiz")}>
                    Create Quiz
                </button>
            </div>
            <hr/>
            <button
                className={styles.logoutBtn}
                onClick={isLoggedIn ? handleLogout : () => navigate("/")}
            >
                {isLoggedIn ? "LOGOUT" : "LOG IN"}
            </button>
        </div>
    );
};

export default SideNavigation;
