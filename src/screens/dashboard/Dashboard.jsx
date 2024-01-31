// src/screens/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css'; // Adjust the path as needed
import { FadeLoader } from 'react-spinners';
import Confetti from 'react-confetti';
import TrendingCard from "../../components/trendingCard/TrendingCard";

/**
 * Dashboard.jsx serves as the homepage for authenticated users, presenting an overview of their quiz activities.
 * It showcases created quizzes, trending quizzes, and a summary of quiz interactions.
 */
const Dashboard = () => {
    const [quizData, setQuizData] = useState(null);
    const [trendingQuizzes, setTrendingQuizzes] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [email, setEmail] = useState(""); // Assume email comes from auth context or similar

    useEffect(() => {
        // Fetch data for dashboard main container
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/userData?email=${email}`)
            .then((response) => {
                const { quizzes, questions, impressions } = response.data;
                setQuizData({ quizzes, questions, impressions });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });

        // Fetch trending quizzes
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/trendingQuizzes?email=${email}`)
            .then((response) => {
                setTrendingQuizzes(response.data);
            })
            .catch((error) => {
                console.error("Error fetching trending quizzes:", error);
            });
    }, [email]);

    useEffect(() => {
        if (quizData !== null && trendingQuizzes) {
            setTimeout(() => {
                setDashboardLoading(false);
            }, 600);
        }
    }, [quizData, trendingQuizzes]);


    const jwtToken = localStorage.getItem("jwt");
    // console.log("jwt from local storage:", jwtToken);

    axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/isloggedin`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
        .then((response) => {
            if (response.data.isLoggedIn) {
                setEmail(response.data.user.email);
                // setIsLoggedIn(response.data.isLoggedIn);
            } else {
                console.log("User is not logged in");
            }
        })
        .catch((error) => {
            console.error("An error occurred:", error);
        });



    return (
        <div className={styles.dashboardContainer}>
            {dashboardLoading ? (
                <div className={styles.loaderContainer}>
                    <FadeLoader color="#474444" />
                </div>
            ) : (
                <div className={styles.dashboardScreen}>
                    <div className={styles.dashboardMainCard}>
                        <div className={styles.totalQuiz}>
                            <div className={styles.dashboardQuizDataNumbers}>
                                {quizData && quizData.quizzes}
                            </div>
                            Quizzes Created
                        </div>
                        <div className={styles.totalQuestions}>
                            <div className={styles.dashboardQuizDataNumbers}>
                                {quizData && quizData.questions}
                            </div>
                            Questions Created
                        </div>
                        <div className={styles.totalImpressions}>
                            <div className={styles.dashboardQuizDataNumbers}>
                                {quizData && quizData.impressions >= 1000
                                    ? `${Math.round(quizData.impressions / 2 / 1000).toFixed(1)}k`
                                    : Math.round(quizData.impressions / 2)}
                            </div>
                            {" "}
                            Impressions
                        </div>
                    </div>
                    <div>
                        <h2>Trending Quiz</h2>
                        <div
                            className={`${styles.trendingQuizCardContainer} ${
                                trendingQuizzes.length > 0 ? "" : styles.firstQuiz
                            }`}
                        >
                            {trendingQuizzes.length > 0 ? (
                                trendingQuizzes.map((quiz) => (
                                    <TrendingCard
                                        key={quiz._id}
                                        quizName={quiz.quizName}
                                        impressions={Math.round(quiz.impressions / 2)}
                                        creationDate={new Date(quiz.date).toLocaleDateString(
                                            "en-US",
                                            {day: "2-digit", month: "short", year: "numeric"}
                                        )}
                                    />
                                ))
                            ) : (
                                <p className={styles.firstQuizPara}>
                                    You haven't created any Quiz, Click on Create Quiz to
                                    create your first Quiz
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
