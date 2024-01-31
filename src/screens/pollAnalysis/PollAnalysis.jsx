import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./PollAnalysis.module.css";
import { FadeLoader } from "react-spinners";

/**
 * PollAnalysis.jsx offers a detailed analysis of poll-type quizzes created by the user.
 * It visualizes the distribution of responses across different poll options.
 */
const PollAnalysis = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/${quizId}`)
            .then((response) => {
                setQuiz(response.data);
            })
            .catch((error) => console.error("Error fetching quiz:", error));
    }, [quizId]);

    if (!quiz) {
        return (
            <div className={styles.loaderContainer}>
                <FadeLoader color="#474444" />
            </div>
        );
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.header}>{quiz.quizName} Poll Analysis</div>

        </div>
    );
};

export default PollAnalysis;
