// src/screens/analytics/Analytics.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Analytics.module.css"; // Ensure to create or update this CSS module
import { FadeLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import EditIcon from "../../assets/images/edit.svg";
import DeleteIcon from "../../assets/images/delete.svg";
import ShareIcon from "../../assets/images/share.svg";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CreateEditQuiz from "../../components/quizQuestionModel/CreateEditQuiz"; // If needed for navigation within Analytics

/**
 * Analytics.jsx provides a detailed view of the analytics related to the quizzes created by the user.
 * It displays information such as the number of attempts, correct answers, and quiz impressions.
 */
const Analytics = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [isAnalyticsLoading, setAnalyticsLoading] = useState(true);
    const navigate = useNavigate(); // Only if navigation is needed
    const [email, setEmail] = useState("");
    const handleShareIconClick = (quizId) => {
        const quizLink = `${process.env.REACT_APP_URL}/quiz/${quizId}`;
        navigator.clipboard
            .writeText(quizLink)
            .then(() => {
                toast.success("Link copied to Clipboard", {
                    position: "top-right",
                    autoClose: 1400,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
            .catch((error) => {
                console.error("Error copying quiz link to clipboard:", error);
            });

    };
    const [showModal, setShowModal] = useState(false);
    const handleDeleteIconClick = (quizId) => {
        setQuizIdToDelete(quizId);
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
    };
    const [quizIdToDelete, setQuizIdToDelete] = useState(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [quizName, setQuizName] = useState("");
    const [quizType, setQuizType] = useState("");
    const [newQuizId, setNewQuizId] = useState(null);

    const handleDelete = () => {
        axios
            .delete(
                `${process.env.REACT_APP_API_BASE_URL}/api/${quizIdToDelete}`
            )
            .then((response) => {
                // Remove the deleted quiz from the state
                setQuizzes(quizzes.filter((quiz) => quiz._id !== quizIdToDelete));
                // Hide the confirmation modal
                setShowModal(false);
                toast.success("Quiz Deleted Successfully");
            })
            .catch((error) =>
                console.error("Error deleting quiz:", error)
            );
        setShowModal(false);
    };

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
            } else {
                console.log("User is not logged in");
            }
        })
        .catch((error) => {
            console.error("An error occurred:", error);
        });

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/api/quizzes?email=${email}`) // Ensure `email` is appropriately sourced
            .then((response) => {
                setQuizzes(response.data);
                setTimeout(() => {
                    setAnalyticsLoading(false);
                }, 1000);
            })
            .catch((error) => {
                console.error("An error occurred while fetching the quizzes:", error);
            });
    }, [email]); // Ensure `email` is appropriately sourced or updated accordingly


    const onQuizUpdateCallback = (response) => {
        // todo : log
        console.log("new quiz create request in parent comp " + response)
        if (response) {
            // Quiz submission was successful
            setShowQuestionModal(false);
            toast.success("successfully updated Quiz", {
                position: "top-right",
                autoClose: 1400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            // Handle submission failure
            // For example, show an error message to the user
            toast.error("Quiz update failed. Please try again.", {
                position: "top-right",
                autoClose: 1400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };
    const onQuizCancel = () => {
        // Logic to handle cancellation
        setShowQuestionModal(false);
    };

    return (
        <div className={styles.rootContainer}>
            {isAnalyticsLoading ? (
                <div className={styles.loaderContainer}>
                    <FadeLoader color="#474444" />
                </div>
            ) : (
                <div className={styles.analyticsScreen}>
                    <h1 className={styles.analyticsHeading}>Quiz Analytics</h1>
                    <table className={styles.analyticsTable}>
                        <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Quiz Name</th>
                            <th>Created on</th>
                            <th>Impression</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {quizzes.map((quiz, index) => (
                            <tr key={quiz._id}>
                                <td>{index + 1}</td>
                                <td>{quiz.quizName}</td>
                                <td>{new Date(quiz.date).toLocaleDateString()}</td>
                                <td>{Math.round(quiz.impressions / 2)}</td>
                                <td>
                                    <img
                                        src={EditIcon}
                                        alt=""
                                        onClick={() => {
                                            const quizName = quiz.quizName;
                                            const quizType = quiz.quizType;
                                            console.log(quizType, quizName, quiz._id);
                                            setNewQuizId(quiz._id);
                                            setQuizType(quizType);
                                            setQuizName(quizName);
                                            if (quizName && quizType) {
                                                setShowQuestionModal(true);
                                            } else {
                                                alert("Please fill in the Quiz Name and Quiz Type");
                                            }
                                        }}
                                    />
                                    <img
                                        src={DeleteIcon}
                                        alt=""
                                        onClick={() => handleDeleteIconClick(quiz._id)}
                                    />
                                    <img
                                        src={ShareIcon}
                                        alt=""
                                        onClick={() => handleShareIconClick(quiz._id)}
                                    />
                                </td>
                                <td
                                    onClick={() => navigate(`/quizanalysis/${quiz._id}`)}
                                    style={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Question Wise Analysis
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            { <ToastContainer />}

            {showQuestionModal && (<div
                className={styles.questionModalOverlay}
                // onClick={handleCreateQuiz}
            >   <CreateEditQuiz
                mode="edit"
                email={email}
                quizName={quizName} // Assuming quizName state is defined
                quizType={quizType} // Assuming quizType state is defined
                onSubmit={(data) => {}}
                onUpdateCallback={(data) => onQuizUpdateCallback(data)}
                onCancel={() => onQuizCancel()}
                quizId={newQuizId} // Pass the newQuizId, if null then pass an empty string
            />
            </div>)}

            {showModal && (
                <div className={styles.modalOverlay} onClick={handleCancel}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalContent}>
                            <p
                                style={{
                                    fontSize: "1.7rem",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Are you sure you want to delete?
                            </p>
                            <div className={styles.buttonContainer}>
                                <button
                                    onClick={handleDelete}
                                    className={styles.confirmDeleteModalButton}
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className={styles.cancelModalButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Analytics;
