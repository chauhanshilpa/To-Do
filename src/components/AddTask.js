import React, { useState } from "react";
import TaskItem from "./TaskItem";
import Header from "./Header";

const AddTask = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleTaskChange(event) {
    setTask(event.target.value);
  }

  function AddTask() {
    setTaskList(taskList.concat(task));
    setTask("");
  }

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      AddTask();
    }
  };

  function getSidebarState() {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }

  return (
    <>
      <div className="container sticky-head">
        <Header getSidebarState={getSidebarState} />
        <div className="task-container input-group mb-3">
          <input
            type="text"
            className="task-input form-control"
            id="task-input"
            placeholder="&#x2b; Add a task"
            aria-label="task"
            aria-describedby="basic-addon1"
            value={task}
            onChange={handleTaskChange}
            onKeyDown={handleKeypress}
          />
        </div>
      </div>
      <div className="container tasks-container d-grid gap-2">
        {taskList.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            taskList={taskList}
            setTaskList={setTaskList}
            taskListIndex={index}
          />
        ))}
      </div>
    </>
  );
};

export default AddTask;
