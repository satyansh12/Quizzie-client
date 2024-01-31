import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Questions.module.css";
import { FadeLoader } from "react-spinners";

/**
 * Questions.jsx is responsible for rendering quiz questions to the user and handling their responses.
 * It supports both question answering for quizzes and option selection for polls.
 */
const Question = () => {
  const [quiz, setQuiz] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOptionClick = (index) => {
    if (quiz && quiz.questions && quiz.questions[0]) {
      setSelectedOptionIndex(index);

      const isCorrect =
        quiz.questions[0].ansOption[currentQuestionIndex] === index;
      const newUserAnswers = { ...userAnswers };
      newUserAnswers[currentQuestionIndex] = isCorrect ? 1 : 0;
      setUserAnswers(newUserAnswers);
    }
  };

  useEffect(() => {
    if (
      quiz &&
      quiz.questions &&
      quiz.questions[0] &&
      quiz.quizType !== "Poll Type" &&
      quiz.questions[0].timerType[currentQuestionIndex] !== "OFF"
    ) {
      setTimer(parseInt(quiz.questions[0].timerType[currentQuestionIndex], 10));
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(countdown);
            return 0;
          } else {
            return prevTimer - 1;
          }
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [currentQuestionIndex, quiz]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/${quizId}`)
      .then((response) => {
        setQuiz(response.data);
      })
      .catch((error) => console.error("Error fetching quiz:", error));
  }, [quizId]);

  const handleNext = () => {
    if (quiz && quiz.questions && quiz.questions[0]) {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);

      if (currentQuestionIndex === pollQuestionsCount - 1) {
        const correctAnswers = Object.values(userAnswers).reduce(
          (sum, answer) => sum + answer,
          0
        );

        axios
          .post(
            `${process.env.REACT_APP_API_BASE_URL}/api/quiz/${quizId}/submit`,
            { userAnswers }
          )
          .catch((error) =>
            console.error("Error submitting quiz answers:", error)
          );

        axios
          .post(
            `${process.env.REACT_APP_API_BASE_URL}/api/quiz/${quizId}/impression`
          )
          .catch((error) =>
            console.error("Error recording impression:", error)
          );

        if (quiz.quizType === "Poll Type") {
          navigate("/pollcompleted");
        } else {
          navigate("/quizcompleted", {
            state: {
              score: correctAnswers,
              totalQuestions: pollQuestionsCount,
            },
          });
        }
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptionIndex(null);
      }
    }
  };

  if (loading || quiz === null) {
    return (
      <div className={styles.loaderContainer}>
        <FadeLoader color="#474444" />
      </div>
    );
  }

  let pollQuestionsCount = 0;
  if (
    quiz &&
    quiz.questions &&
    quiz.questions[0] &&
    quiz.questions[0].pollQuestion
  ) {
    pollQuestionsCount = Object.keys(quiz.questions[0].pollQuestion).length;
  }
  console.log(pollQuestionsCount);

  if (
    quiz &&
    quiz.questions &&
    quiz.questions[0] &&
    quiz.questions[0].options
  ) {
    console.log(quiz.questions[0].options[currentQuestionIndex]);
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.questionContent}>
          <div className={styles.header}>
            <div className={styles.questionNumber}>
              0{currentQuestionIndex + 1}/0{pollQuestionsCount}
            </div>
            <div className={styles.timer}>
              {quiz.quizType !== "Poll Type" &&
                quiz.questions[0].timerType[currentQuestionIndex] !== "OFF" &&
                `00:0${timer} Sec`}
            </div>
          </div>
          <div className={styles.pollQuestion}>
            {quiz &&
              quiz.questions &&
              quiz.questions[0] &&
              quiz.questions[0].pollQuestion &&
              quiz.questions[0].pollQuestion[currentQuestionIndex] && (
                <>
                  {currentQuestionIndex + 1}.{" "}
                  {quiz.questions[0].pollQuestion[currentQuestionIndex]}
                  <div className={styles.options}>
                    {quiz.questions[0].options && quiz.questions[0].options[currentQuestionIndex] && quiz.questions[0].options[currentQuestionIndex].map(
                        (option, index) => {
                          const hasImage = option.imageURL && option.imageURL.trim() !== "";
                          const hasText = option.text && option.text.trim() !== "";
                          return (
                              <div
                                  key={index}
                                  className={`${styles.option} ${
                                      index === selectedOptionIndex ? styles.selectedOption : ""
                                  }`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleOptionClick(index)}
                              >
                                {hasImage && (
                                    <div>
                                      <img
                                          className={styles.optionImage}
                                          src={option.imageURL}
                                          alt=""
                                      />
                                    </div>
                                )}
                                {hasText && <div>{option.text}</div>}
                              </div>
                          );
                        }
                      )}
                  </div>
                </>
              )}
          </div>

          <button
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={selectedOptionIndex === null}
          >
            {currentQuestionIndex === pollQuestionsCount - 1
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Question;
