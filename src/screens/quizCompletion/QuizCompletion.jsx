import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import styles from "./QuizCompletion.module.css";
import TrophyImage from "../../assets/images/trophy.png";
import Confetti from "react-confetti";

/**
 * QuizCompletion.jsx is displayed upon the completion of a quiz, summarizing the user's performance.
 * It shows the user's score and offers a celebratory message for quiz completion.
 */
const QuizCompletion = () => {
  const location = useLocation();
  const { score, totalQuestions } = location.state;

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <FadeLoader color="#474444" />
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.thankYouContainer}>
        <div className={styles.headding}>Congrats Quiz is completed</div>
        <img src={TrophyImage} alt="" className={styles.trophyImage} />
        <div className={styles.quizScore}>
          Your Score is{" "}
          <span className={styles.scoreColor}>
            {" "}
            {score}/{totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizCompletion;
