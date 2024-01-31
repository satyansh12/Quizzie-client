import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import styles from './CreateEditQuiz.module.css'; // Adjust the path as needed

/**
 * CreateEditQuiz.jsx is a component for creating and editing quizzes.
 * It allows users to define quiz properties, add questions, and set options with a dynamic form.
 */
const CreateEditQuiz = ({mode, email, quizName, quizType, onSubmit, onUpdateCallback, onCancel, quizId}) => {
    const [questions, setQuestions] = useState([1]);
    useEffect(() => {
        console.log(questions);
    }, [questions]);
    useEffect(() => {
        if (mode === "edit" && quizId) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/${quizId}`, {
                method: "GET",
            })
                .then(response => {
                    if (!response.ok) {
                        // toast.error("Error: Failed to fetch quiz details");
                        alert("Error : Failed to fetch quiz details");
                        throw new Error('Failed to fetch quiz details');
                    }
                    return response.json();
                })
                .then(data => {
                    // Assuming data.questions is an array with the structure as described
                    const fetchedQuestions = data.questions;
                    setQuestions(fetchedQuestions);
                    // Assuming each question is structured as described and we're editing the first question
                    const firstQuestion = fetchedQuestions[0];
                    setPollQuestion({0: firstQuestion.pollQuestion["0"]});
                    setOptions(firstQuestion.options);
                    setAnsOption(firstQuestion.ansOption);
                    setTimerType(firstQuestion.timerType);
                    // Initialize as if both text and imageURL are absent
                    let optionType = -1;
                    // Check the first option set to determine the type
                    const firstOptionSet = firstQuestion.options[0];
                    if (firstOptionSet.every(option => option.text && option.imageURL)) {
                        optionType = 2; // Both Text and Image URL
                    } else if (firstOptionSet.every(option => option.text)) {
                        optionType = 0; // Text only
                    } else if (firstOptionSet.every(option => option.imageURL)) {
                        optionType = 1; // Image URL only
                    }
                    setSelectedOptionType(optionType);
                })
                .catch(error => {
                    alert(`Error : Error fetching quiz details: ${error}`);
                });
        }
    }, [mode, quizId]); // Depend on mode and quizId to re-run this effect if they change
    //Question Modal -
    //for question numbers
    const handleAddQuestion = () => {
        if (questions.length < 5) {
            setQuestions([...questions, {title: ""}]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleDeleteQuestion = (index) => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);

            if (currentQuestionIndex === index) {
                setCurrentQuestionIndex(index > 0 ? index - 1 : 0);
            } else if (currentQuestionIndex > index) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
            }
        }
        // setCurrentQuestionIndex(index-1)
    };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        // Perform side effects here when currentQuestionIndex changes
    }, [currentQuestionIndex]);

    // Update question number change handler to set current question index
    const handleQuestionNoChange = (index) => {
        setCurrentQuestionIndex(index);
    };

    //for questions and options
    const handleOptionTypeSelect = (index) => {
        setSelectedOptionType(index);
    };

    const [pollQuestion, setPollQuestion] = useState({});
    const handleQuestionTextChange = (e, index) => {
        const updatedQuestions = {...pollQuestion};
        updatedQuestions[index] = e.target.value;
        setPollQuestion(updatedQuestions);
    };

    const [options, setOptions] = useState(Array(5)
        .fill()
        .map(() => [{text: "", imageURL: ""}, {text: "", imageURL: ""}, {text: "", imageURL: ""}, {
            text: "",
            imageURL: ""
        },]));

    const [selectedOptionType, setSelectedOptionType] = useState(0);
    const [ansOption, setAnsOption] = useState({});
    const handleRadioSelect = (index) => {
        const updatedAnsOptions = {...ansOption};
        updatedAnsOptions[currentQuestionIndex] = index;
        setAnsOption(updatedAnsOptions);
    };

    const [timerType, setTimerType] = useState({0: '5 Sec'});

    // const handleTimerTypeSelect = (value) => {
    //     // Create an updatedTimerTypes object where every question index is set to the same value
    //     const updatedTimerTypes = Object.keys(timerType).reduce((acc, key) => {
    //         acc[key] = value;
    //         return acc;
    //     }, {});
    //
    //     // If there are no keys in timerType, initialize it for the first question
    //     if (Object.keys(timerType).length === 0) {
    //         updatedTimerTypes[0] = value;
    //     }
    //
    //     setTimerType(updatedTimerTypes);
    // };
    const handleTimerTypeSelect = (value) => {
        const updatedTimerTypes = {...timerType};
        updatedTimerTypes[currentQuestionIndex] = value;
        setTimerType(updatedTimerTypes);
    };
    const handleOptionTextChange = (e, questionIndex, optionIndex) => {
        const updatedOptions = [...options];
        updatedOptions[questionIndex][optionIndex] = {
            ...updatedOptions[questionIndex][optionIndex], text: e.target.value,
        };
        setOptions(updatedOptions);
    };
    const handleOptionImageURLChange = (e, questionIndex, optionIndex) => {
        const updatedOptions = [...options];
        updatedOptions[questionIndex][optionIndex] = {
            ...updatedOptions[questionIndex][optionIndex], imageURL: e.target.value,
        };
        setOptions(updatedOptions);
    };
    const handleCancel = () => {
        onCancel();
        // Logic to handle cancellation (e.g., clear form, close modal)
    };
    // Step 2: Create a separate validation function
    const validateQuiz = () => {
        const isPollQuestionFilled = pollQuestion[0] !== "";
        const isOptionsFilled = options.some((option) => option.some((item) => item.text !== "" || item.imageURL !== ""));
        const isAnsOptionFilled = Object.values(ansOption).some((value) => value !== null);
        const isTimerTypeFilled = quizType !== "Poll Type" ? Object.values(timerType).some((value) => value !== "") : true;
        // Ensure all questions up to the current index have a timerType set
        if (!isPollQuestionFilled) {
            alert("Poll question is not filled. Please fill it.");
            return;
        }
        if (selectedOptionType === null) {
            alert("Selected option type is not set. Please set it.");
            return;
        }
        if (!isOptionsFilled) {
            alert("Options are not filled. Please fill it.");
            return;
        }
        if (!isAnsOptionFilled) {
            alert("Answer option is not set. Please set it.");
            return;
        }
        if (!isTimerTypeFilled) {
            alert("Timer type is not set. Please set it.");
            return;
        }
        if (!quizName || !quizType) {
            alert("Please fill in the Quiz Name and Quiz Type");
            return;
        }
        return true;
    };
    const resetState = () => {
        // delete data in states
        setPollQuestion("");
        setOptions(Array(5)
            .fill()
            .map(() => [{text: "", imageURL: ""}, {text: "", imageURL: ""}, {text: "", imageURL: ""}, {
                text: "",
                imageURL: ""
            },]));
        setAnsOption({});
        setTimerType({});
        setQuestions([1]);
        setCurrentQuestionIndex(0);
    };
    const handleCreateQuizSubmit = () => {
        // console.log(options);
        if (!validateQuiz()) {
            // Validation failed
            return;
        }
        const questions = [{
            pollQuestion, timerType, options, ansOption,
        },];
        axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/api/createquiz`, {quizName, quizType, questions, email}, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                onSubmit(response.data.id)
            })
            .catch((error) => {
                console.error("An error occurred while saving the quiz:", error);
            });

        resetState();
    };

    const handleUpdateQuizSubmit = () => {
        if (!validateQuiz()) {
            return;
        }
        const questions = [{
            pollQuestion, timerType, options, ansOption,
        },];
        console.log("Updating  new quiz" + quizId)
        axios
            .put(`${process.env.REACT_APP_API_BASE_URL}/api/${quizId}`, {quizName, quizType, questions, email}, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                onUpdateCallback(response)
                // setNewQuizId();
            })
            .catch((error) => {
                console.error("An error occurred while saving the quiz:", error);
            });
        resetState();
    }

    // Render form fields, submit button, etc.
    return (
        <div
            className={styles.questionModal}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles.modalContent}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}
                     className={styles.questionNoContainer}>
                    <div style={{display: "flex", gap: ".5rem", alignItems: "center"}}>
                        {questions.map((question, index) => (
                            <div
                                className={`${styles.questionNo} ${index === currentQuestionIndex ? styles.activeQuestionNumber : ""}`}
                                key={question._id} onClick={() => handleQuestionNoChange(index)}>
                                {index + 1}
                                {index !== 0 && (
                                    <span className={styles.crossBtn} onClick={() => handleDeleteQuestion(index)}>
                                    x
                                </span>
                                )}
                            </div>
                        ))}
                        {questions.length < 5 && (
                            <div className={styles.addBtn} onClick={handleAddQuestion}>
                                +
                            </div>
                        )}
                    </div>
                    <p>Max 5 Questions</p>
                </div>
                <div className={styles.questionContent}>
                    <div>
                        <input
                            type="text"
                            placeholder={quizType === 'Q & A' ? "Quiz Question" : "Poll Question"}
                            value={pollQuestion[currentQuestionIndex] || ""}
                            onChange={(e) => handleQuestionTextChange(e, currentQuestionIndex)}
                            className={styles.pollQuestion}
                        />
                    </div>

                    <div
                        className={styles.pollOptionType}
                        style={{display: "flex"}}
                    >
                        <div style={{marginRight: "1.5rem"}}>Option Type:</div>
                        <label className={styles.modalLabel}>
                            <input
                                type="radio"
                                name="optionType"
                                checked={selectedOptionType === 0}
                                onChange={() => handleOptionTypeSelect(0)}
                            />
                            Text
                        </label>
                        <label
                            className={styles.modalLabel}
                            style={{marginLeft: ".5rem"}}
                        >
                            <input
                                type="radio"
                                name="optionType"
                                checked={selectedOptionType === 1}
                                onChange={() => handleOptionTypeSelect(1)}
                            />
                            Image URL
                        </label>
                        <label
                            className={styles.modalLabel}
                            style={{marginLeft: ".5rem"}}
                        >
                            <input
                                type="radio"
                                name="optionType"
                                checked={selectedOptionType === 2}
                                onChange={() => handleOptionTypeSelect(2)}
                            />
                            Text and Image URL
                        </label>
                    </div>
                    <div
                        className={styles.pollOptions}
                        style={{display: "flex", flexDirection: "column"}}
                    >
                        {[0, 1, 2, 3].map((index) => (<div className={styles.modalLabel} key={index}>
                            {/* {quizType === 'Q & A' && (
                                <input
                                    type="radio"
                                    name="ansOption"
                                    checked={ansOption[currentQuestionIndex] === index}
                                    onChange={() => handleRadioSelect(index)}
                                />
                            )}*/}
                            {
                                <input
                                    type="radio"
                                    name="ansOption"
                                    checked={ansOption[currentQuestionIndex] === index}
                                    onChange={() => handleRadioSelect(index)}
                                />
                            }
                            {selectedOptionType === 0 && (<input
                                type="text"
                                name={`optionText_${index}`}
                                value={options[currentQuestionIndex][index].text}
                                placeholder="Option"
                                onChange={(e) => handleOptionTextChange(e, currentQuestionIndex, index)}
                                className={`${styles.optionInput} ${ansOption && ansOption[currentQuestionIndex] === index ? styles.greenBackground : ""}`}
                            />)}
                            {selectedOptionType === 1 && (<input
                                type="url"
                                name={`optionImageURL_${index}`}
                                value={options[currentQuestionIndex][index].imageURL}
                                placeholder="Option Image URL"
                                onChange={(e) => handleOptionImageURLChange(e, currentQuestionIndex, index)}
                                className={`${styles.optionInput} ${ansOption && ansOption[currentQuestionIndex] === index ? styles.greenBackground : ""}`}
                            />)}
                            {selectedOptionType === 2 && (<>
                                <input
                                    type="text"
                                    name={`optionText_${index}`}
                                    value={options[currentQuestionIndex][index].text}
                                    placeholder="Option"
                                    onChange={(e) => handleOptionTextChange(e, currentQuestionIndex, index)}
                                    className={`${styles.optionInput} ${ansOption && ansOption[currentQuestionIndex] === index ? styles.greenBackground : ""}`}
                                />

                                <input
                                    type="url"
                                    name={`optionImageURL_${index}`}
                                    value={options[currentQuestionIndex][index].imageURL}
                                    placeholder="Option Image URL"
                                    onChange={(e) => handleOptionImageURLChange(e, currentQuestionIndex, index)}
                                    className={`${styles.optionInput} ${ansOption && ansOption[currentQuestionIndex] === index ? styles.greenBackground : ""}`}
                                />
                            </>)}
                        </div>))}
                    </div>

                    {quizType !== "Poll Type" && (<div
                        className={styles.timerType}
                        style={{display: "flex"}}
                    >
                        <div style={{marginRight: "auto"}}>Timer Type:</div>
                        <label className={styles.modalLabel}>
                            <input
                                type="radio"
                                name="timerType"
                                value="5 Sec"
                                checked={timerType[currentQuestionIndex] === "5 Sec"}
                                onChange={() => handleTimerTypeSelect("5 Sec")}
                            />{" "}
                            5 Sec
                        </label>
                        <label
                            className={styles.modalLabel}
                            style={{marginLeft: ".5rem"}}
                        >
                            <input
                                type="radio"
                                name="timerType"
                                value="10 Sec"
                                checked={timerType[currentQuestionIndex] === "10 Sec"}
                                onChange={() => handleTimerTypeSelect("10 Sec")}
                            />
                            10 Sec
                        </label>
                        <label
                            className={styles.modalLabel}
                            style={{marginLeft: ".5rem"}}
                        >
                            <input
                                type="radio"
                                name="timerType"
                                value="OFF"
                                checked={timerType[currentQuestionIndex] === "OFF"}
                                onChange={() => handleTimerTypeSelect("OFF")}
                            />{" "}
                            OFF
                        </label>
                    </div>)}
                    <div className={styles.buttonContainer}>
                        <button
                            onClick={onCancel}
                            className={styles.cancelModalButton}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={mode === 'edit' ? handleUpdateQuizSubmit : handleCreateQuizSubmit}
                            className={styles.confirmCreateQuizButton}
                        >
                            {mode === 'edit' ? 'Update Quiz' : 'Create Quiz'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEditQuiz;
