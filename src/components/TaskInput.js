import React, { useState } from "react";
import ToDoItem from "./ToDoItem";

const TaskInput = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);

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

  return (
    <>
      <div className="container input-group mb-3">
        <input
          type="text"
          className="task-input form-control"
          placeholder="&#x2b; Add a task"
          aria-label="task"
          aria-describedby="basic-addon1"
          value={task}
          onChange={handleTaskChange}
          onKeyDown={handleKeypress}
        />
      </div>
      <div className="container to-do-list d-grid gap-2">
        {taskList.length > 0 && <h4>My Notes</h4>}
        {taskList.map((task, index) => (
          <ToDoItem
            key={index}
            task={task}
            taskList={taskList}
            setTaskList={setTaskList}
            taskListIdx={index}
          />
        ))}
      </div>
    </>
  );
};

export default TaskInput;
