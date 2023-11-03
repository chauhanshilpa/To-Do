import React from "react";

/**
 * 
 * @param {*} props 
 * @returns a type of alert with a message.
 */
const Alert = (props) => {
  const { alert } = props;

  return (
    <div className="notification">
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          <strong>{alert.type}</strong> {alert.message}
        </div>
      )}
    </div>
  );
};

export default Alert;
