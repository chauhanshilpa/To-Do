import React from "react";
import { theme } from "../Constants";

const TasksInputField = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    inputTask,
    handleInputTaskChange,
    handleNewTask,
  } = props;

  return (
    <div
      className={`task-input-field ${sidebarOpenState && "open-sidebar"} ${
        appBodyTheme === theme.dark.name && theme.dark.className
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
          onKeyDown={handleNewTask}
        />
      </div>
    </div>
  );
};

export default TasksInputField;
