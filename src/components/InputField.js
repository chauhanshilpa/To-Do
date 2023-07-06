import React from "react";

const InputField = (props) => {
  const { inputTask, handleInputTaskChange, handleInputFieldKeypress } = props;

  return (
    <div className="container task-container sticky-head input-group mb-3">
      <input
        type="text"
        className="task-input form-control"
        id="task-input"
        placeholder="&#x2b; Add a task"
        aria-label="Add a task"
        aria-describedby="basic-addon1"
        value={inputTask}
        onChange={handleInputTaskChange}
        onKeyDown={handleInputFieldKeypress}
      />
    </div>
  );
};

export default InputField;
