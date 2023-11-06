import React from "react";

/**
 * @param {*} props
 * @returns a type of alert with a message.
 */
const Alert = (props) => {
  const { alert } = props;

  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  
  return (
    <div className="notification">
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          <strong>{capitalize(alert.type)}</strong> {alert.message}
        </div>
      )}
    </div>
  );
};

export default Alert;
