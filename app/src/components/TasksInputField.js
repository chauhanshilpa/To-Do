import React from "react";

const TasksInputField = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    inputTask,
    handleInputTaskChange,
    addTask,
  } = props;

  return (
    <div
      className={`task-input-field ${sidebarOpenState && "open-sidebar"} ${
        appBodyTheme === "dark" && "theme-dark"
      }`}
    >
      <div className="container input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="&#x2b; Add a task"
          aria-label="Add a task"
          aria-describedby="basic-addon1"
          value={inputTask}
          onChange={handleInputTaskChange}
          onKeyDown={addTask}
        />
      </div>
    </div>
  );
};

export default TasksInputField;
