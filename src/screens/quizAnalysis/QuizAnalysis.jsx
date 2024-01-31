import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./QuizAnalysis.module.css";
import { FadeLoader } from "react-spinners";

/**
 * QuizAnalysis.jsx provides a comprehensive analysis of quiz-type activities, including question-wise breakdowns.
 * It helps users understand performance metrics and engagement for each quiz question.
 */
const QuizAnalysis = () => {
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
  window.onload = () => {
    const boxes = document.querySelector('.boxes');
    const analyticsBoxes = document.querySelector('.analytics_boxes');

    const boxesWidth = boxes.offsetWidth;
    const analyticsBoxesWidth = analyticsBoxes.offsetWidth;

    const maxWidth = Math.max(boxesWidth, analyticsBoxesWidth);

    boxes.style.width = `${maxWidth}px`;
    analyticsBoxes.style.width = `${maxWidth}px`;
  };

  return (
      <div className={styles.mainContainer}>
        {quiz.questions.map((question, questionIndex) => {
          <div className={styles.header}>{quiz.quizName} Question Analysis</div>
          if (quiz.quizType === "Q & A") {
            const totalAttempts = Math.round(quiz.impressions / 2);
            const correctAttempts =
                (quiz.correctAnswers && quiz.correctAnswers[questionIndex]) || 0;
            const incorrectAttempts = totalAttempts - correctAttempts;
            return (
                <div key={questionIndex} className={styles.questionAnalysisContainer}>
                  <div className={styles.question}>
                    Q.{questionIndex + 1} {Object.values(question.pollQuestion)}
                  </div>
                  <div className={styles.boxes}>
                    <div className={styles.totalAttemptsBox}>
                      <div>{totalAttempts}</div>
                      People Attempted the Question
                    </div>
                    <div className={styles.correctAttemptsBox}>
                      <div>{correctAttempts}</div>
                      People Attempted Correctly
                    </div>
                    <div className={styles.incorrectAttemptsBox}>
                      <div>{incorrectAttempts}</div>
                      People Attempted Incorrectly
                    </div>
                  </div>
                </div>
            );
          } else if (quiz.quizType === "Poll Type") {
            return (
                <div className={styles.mainContainer}>
                  <div className={styles.header}>{quiz.quizName} Poll Analysis</div>
                  {quiz.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className={styles.questionAnalysisContainer}>
                        <div className={styles.question}>
                          Q.{questionIndex + 1} {Object.values(question.pollQuestion)}
                        </div>
                        <div className={styles.boxes}>
                          {question.options[0].map((option, optionIndex) => (
                              <div key={optionIndex} className={styles.analysisCard}>
                                <div className={styles.optionCount}>
                                  <strong>{option.count}</strong>
                                </div> {option.text}
                              </div>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>
            );
          }
          return null;
        })}
      </div>
  );
};

export default QuizAnalysis;
