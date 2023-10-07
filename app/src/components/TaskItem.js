import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import sound from "../audio/taskIsDone.wav";
import axios from "axios";

const TaskItem = (props) => {
  const {
    taskIndex,
    appBodyTheme,
    currentListUUID,
    currentListTask,
    setTaskList,
  } = props;

  const [isTaskItemEditable, setIsTaskItemEditable] = useState(false);

  const baseURL = process.env.REACT_APP_API_BASIC_URL;

  async function toggleTaskCompletion(taskIndex) {
    currentListTask.done = !currentListTask.done;
    let response = await axios.get(`${baseURL}/task_done`, {
      params: {
        taskIndex: JSON.stringify(taskIndex),
        currentListTask: JSON.stringify(currentListTask),
        currentListUUID: JSON.stringify(currentListUUID),
      },
    });
    setTaskList(response.data.taskList);
    if (currentListTask.done) {
      new Audio(sound).play();
      setIsTaskItemEditable(false);
    }
  }

  function toggleTaskEditStatus() {
    setIsTaskItemEditable(!isTaskItemEditable);
  }

  async function handleTaskUpdation(event, taskIndex) {
    if (event.keyCode === 13) {
      event.preventDefault();
      let newInnerText = event.target.innerText;
      let response = await axios.get(`${baseURL}/update_task`, {
        params: {
          taskIndex: JSON.stringify(taskIndex),
          currentListUUID: JSON.stringify(currentListUUID),
          newInnerText,
        },
      });
      setTaskList(response.data.taskList);
      setIsTaskItemEditable(false);
    }
  }

  async function handleTaskDeletion(taskIndex) {
    let response = await axios.get(`${baseURL}/delete_task`, {
      params: {
        taskIndex: JSON.stringify(taskIndex),
        currentListUUID: JSON.stringify(currentListUUID),
        currentListTask: JSON.stringify(currentListTask),
      },
    });
    setTaskList(response.data.taskList);
    setIsTaskItemEditable(false);
  }

  return (
    <>
      <div
        className={`task-item ${appBodyTheme === "dark" && "theme-dark"}`}
        style={{
          textDecoration: currentListTask.done ? "line-through" : "none",
          border: isTaskItemEditable && "2px solid grey",
        }}
        contentEditable={isTaskItemEditable}
        suppressContentEditableWarning={true}
        onKeyDown={(event) => handleTaskUpdation(event, taskIndex)}
        onDoubleClick={toggleTaskEditStatus}
      >
        <div className="task-checkbox">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            aria-hidden="true"
            fill="currentColor"
            className="bi bi-check2-circle"
            viewBox="0 0 18 18"
            focusable="false"
            onClick={() => toggleTaskCompletion(taskIndex)}
            data-tooltip-id="taskDone-checkbox"
            data-tooltip-content="Done"
          >
            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
          </svg>
          <Tooltip className="tooltip" id="taskDone-checkbox" />
        </div>
        <div className="taskItem-text">{currentListTask.text}</div>
        <div className="edit-and-delete-buttons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-square"
            viewBox="0 0 16 16"
            onClick={toggleTaskEditStatus}
            data-tooltip-id="edit-task"
            data-tooltip-content="Edit"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </svg>
          <Tooltip className="tooltip" id="edit-task" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash3"
            viewBox="0 0 16 16"
            onClick={() => handleTaskDeletion(taskIndex)}
            data-tooltip-id="delete-task"
            data-tooltip-content="Delete"
          >
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
          </svg>
          <Tooltip className="tooltip" id="delete-task" />
        </div>
      </div>
    </>
  );
};

export default TaskItem;
