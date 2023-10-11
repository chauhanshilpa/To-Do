import React, { useState } from "react";
import { THEME, ENTER_KEY_CODE } from "../Constants";
import { updateTask, deleteTask, setTaskDone } from "../api";
import { Tooltip } from "react-tooltip";
import sound from "../audio/taskIsDone.wav";

/**
 *
 * @param {*} props
 * @returns task items of respective list
 */
const TaskItem = (props) => {
  const {
    taskIndex,
    appBodyTheme,
    modalButtonRef,
    currentListUUID,
    taskInfo,
    setTaskList,
  } = props;

  const [isTaskItemEditable, setIsTaskItemEditable] = useState(false);

  /**
   * changes undone task to done and vice versa.If task is done then a audio plays and changes the text decoration of that task
   */
  async function toggleTaskCompletion() {
    try {
      taskInfo.done = !taskInfo.done;
      const response = await setTaskDone(taskIndex, taskInfo, currentListUUID);
      setTaskList(response.data.taskList);
      if (taskInfo.done) {
        new Audio(sound).play();
        setIsTaskItemEditable(false);
      }
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  function toggleTaskEditStatus() {
    setIsTaskItemEditable(!isTaskItemEditable);
  }

  /**
   * update the text and the taskList
   * @param {*} event
   */
  async function handleTaskUpdate(event) {
    try {
      if (event.keyCode === ENTER_KEY_CODE) {
        let newInnerText = event.target.innerText;
        const response = await updateTask(
          taskIndex,
          currentListUUID,
          newInnerText
        );
        setTaskList(response.data.taskList);
        setIsTaskItemEditable(false);
      }
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   * delete selected task and update taskList
   */
  async function handleTaskDeletion() {
    try {
      const response = await deleteTask(taskIndex, currentListUUID, taskInfo);
      setTaskList(response.data.taskList);
    } catch (error) {
      console.log("in catch");
      modalButtonRef.current.click();
    }
    setIsTaskItemEditable(false);
  }

  // taskInfo contains unique id of task, text value, creation date and done property.
  return (
    <>
      <div
        className={`task-item ${
          appBodyTheme === THEME.DARK.name && THEME.DARK.className
        }`}
        style={{
          textDecoration: taskInfo.done ? "line-through" : "none",
          border: isTaskItemEditable && "2px solid grey",
        }}
        contentEditable={isTaskItemEditable}
        suppressContentEditableWarning={true}
        onKeyDown={handleTaskUpdate}
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
            onClick={toggleTaskCompletion}
            data-tooltip-id="taskDone-checkbox"
            data-tooltip-content="Done"
          >
            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
          </svg>
          <Tooltip className="tooltip" id="taskDone-checkbox" />
        </div>
        <div className="taskItem-text">{taskInfo.text}</div>
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
            onClick={handleTaskDeletion}
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
