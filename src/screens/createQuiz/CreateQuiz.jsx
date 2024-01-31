// src/screens/createQuiz/CreateQuiz.jsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CreateQuiz.module.css';
import CreateEditQuiz from "../../components/quizQuestionModel/CreateEditQuiz"; // Ensure you have the CSS module for CreateQuiz

/**
 * CreateQuiz.jsx is the interface for users to start the process of creating a new quiz.
 * It captures initial quiz details like name and type before proceeding to question creation.
 */
const CreateQuiz = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showQuizPublishedModal, setShowQuizPublishedModal] = useState(false);
    // todo : fix
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [newQuizId, setNewQuizId] = useState(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [quizName, setQuizName] = useState("");
    const [quizType, setQuizType] = useState("");
    // Add the rest of your state and functions here, as extracted from Dashboard.jsx
    const handleCancel = () => {
        setShowModal(false);
        setShowQuizPublishedModal(false);
    };
    //for createQuiz Screen
    const [email, setEmail] = useState("");
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

    const handleCancelQuizModal = () => {
        navigate("/dashboard");
    };

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

    const handleShowQuizQueModal = () => {
        if (quizName && quizType) {
            setShowQuestionModal(true);
        } else {
            alert("Please fill in the Quiz Name and Quiz Type");
        }
    };

    const onQuizSubmit = (quizId) => {
        // todo : log
        console.log("new quiz create request in parent comp " + quizId)
        if (quizId) {
            // Quiz submission was successful
            setShowQuestionModal(false);
            setNewQuizId(quizId); // Assuming you want to store the new Quiz ID
            setShowQuizPublishedModal(true);
            toast.success("Quiz Created Successfully", {
                position: "top-right",
                autoClose: 1400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            //  reset fields
            setQuizName("");
            setQuizType("");
        } else {
            // Handle submission failure
            // For example, show an error message to the user
            toast.error("Quiz submission failed. Please try again.");
        }
    };

    const onQuizUpdateCallback = (data) => { /* No Update required, as quiz is in edit mode */
    };
    const onQuizCancel = () => {
        // Logic to handle cancellation
        setShowQuestionModal(false);
    };

    const notifyLinkCopied = () => {
        if (newQuizId) {
            const quizLink = `${process.env.REACT_APP_URL}/quiz/${newQuizId}`;
            navigator.clipboard
                .writeText(quizLink)
                .then(() => {
                    // The copy operation was successful
                })
                .catch((err) => {
                    // The copy operation failed
                    console.error("Failed to copy quiz link: ", err);
                });
        }
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
    };


    // Include JSX for the create quiz UI
    return (<div className={styles.createQuizContainer}>
        <div className={styles.createQuizScreen}>
            <div className={styles.modalOverlay}>
                <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.modalQuizNameContent}>
                        <div>
                            <input
                                type="text"
                                placeholder="Quiz name"
                                value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}
                                className={styles.modalQuizNameInput}
                            />
                        </div>
                        <div className={styles.modalQuizTypeContainer}>
                            <div>Quiz Type</div>
                            <label className={styles.modalLabel}>
                                <input
                                    type="radio"
                                    value="Q & A"
                                    checked={quizType === "Q & A"}
                                    onChange={() => setQuizType("Q & A")}
                                    className={styles.modalRadio}
                                />
                                Q & A
                            </label>
                            <label className={styles.modalLabel}>
                                <input
                                    type="radio"
                                    value="Poll Type"
                                    checked={quizType === "Poll Type"}
                                    onChange={() => setQuizType("Poll Type")}
                                    className={styles.modalRadio}
                                />
                                Poll Type
                            </label>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button
                                onClick={handleCancelQuizModal}
                                className={styles.cancelModalButton}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShowQuizQueModal}
                                className={styles.confirmQuizNameButton}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {<ToastContainer/>}
        {showQuestionModal && (<div
            className={styles.questionModalOverlay}
            // onClick={handleCreateQuiz}
        ><CreateEditQuiz
            mode="create"
            email={email}
            quizName={quizName} // Assuming quizName state is defined
            quizType={quizType} // Assuming quizType state is defined
            onSubmit={(data) => onQuizSubmit(data)}
            onUpdateCallback={() => onQuizUpdateCallback()}
            onCancel={() => onQuizCancel()}
            quizId={newQuizId || ""} // Pass the newQuizId, if null then pass an empty string
        />
        </div>)}

        {showQuizPublishedModal && (<div className={styles.modalOverlay} onClick={handleCancel}>
            {/*<Confetti width={width} height={height}/>*/}
            <div
                className={styles.modalPublished}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalContent}>
                    <p
                        style={{
                            fontSize: "1.7rem", fontWeight: "bold", textAlign: "center",
                        }}
                    >
                        Congrats your Quiz is <br/>
                        Published!
                    </p>
                    <div className={styles.quizLink}>
                        {newQuizId ? `${process.env.REACT_APP_URL}/quiz/${newQuizId}` : "Link loading... "}
                    </div>

                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.shareLinkBtn}
                            onClick={notifyLinkCopied}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>)}
    </div>);
};

export default CreateQuiz;