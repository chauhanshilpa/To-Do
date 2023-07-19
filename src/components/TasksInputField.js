import React from "react";

const TasksInputField = (props) => {
  const {
    inputTask,
    handleInputTaskChange,
    handleInputTaskKeypress,
    sidebarOpenState,
  } = props;

  return (
    <div
      className={`container task-input-field input-group mb-3 ${
        sidebarOpenState && "open-sidebar"
      }`}
    >
      <input
        type="text"
        className="task-input form-control"
        id="task-input"
        placeholder="&#x2b; Add a task"
        aria-label="Add a task"
        aria-describedby="basic-addon1"
        value={inputTask}
        onChange={handleInputTaskChange}
        onKeyDown={handleInputTaskKeypress}
      />
    </div>
  );
};

export default TasksInputField;
