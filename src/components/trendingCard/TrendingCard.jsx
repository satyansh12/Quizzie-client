import React from "react";
import ImpressionsIcon from "../../assets/images/impressions.svg";
import styles from "./TrendingCard.module.css";

/**
 * TrendingCard displays key information about a quiz, including its name,
 * number of impressions, and creation date, used in showcasing trending quizzes.
 */
const TrendingCard = ({ quizName, impressions, creationDate }) => {
  return (
    <>
      <div className={styles.trendingQuizCard}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={styles.quizName}>{quizName}</div>
          <div className={styles.impressions}>{impressions}</div>
          <img src={ImpressionsIcon} alt="" />
        </div>
        <div className={styles.creationDate}>Created on : {creationDate}</div>
      </div>
    </>
  );
};

export default TrendingCard;
