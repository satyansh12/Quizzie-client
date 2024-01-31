import React from "react";

/**
 * ItemNotFound.jsx is a simple component displayed when a user navigates to an undefined route.
 * It provides feedback that the requested page does not exist.
 */
const ItemNotFound = () => {
  return (
    <div
      style={{
        fontSize: "4rem",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      Page Not Found
    </div>
  );
};

export default ItemNotFound;
