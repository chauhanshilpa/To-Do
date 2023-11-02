import React, { useState } from "react";
import { THEME, ENTER_KEY_CODE } from "../Constants";
import { updateTask, deleteTask, reverseTaskDone } from "../api";
import { Tooltip } from "react-tooltip";
import sound from "../audio/taskIsDone.wav";

/**
 *
 * @param {*} props
 * @returns task item of respective list
 */
const TaskItem = (props) => {
  const {
    appBodyTheme,
    modalButtonRef,
    predefinedList,
    currentListUUID,
    taskInfo,
    getTaskListAndListName,
  } = props;

  const [isTaskItemEditable, setIsTaskItemEditable] = useState(false);
  const { task_id } = taskInfo;
  const { text } = taskInfo.metadata;
  const { RECYCLE_BIN_LIST } = predefinedList;


  /**
   *
   * calls reverseTaskDone defined in api.js then calls getTaskListAndListName function defined in app.js to get task list and name with updated value of is_done property.
   * if task is done, a done audio is played and text decoration of text will be changed to line-through
   */
  async function toggleTaskCompletion() {
    try {
      const currentIsDone = taskInfo.is_done;
      await reverseTaskDone(task_id, currentIsDone);
      await getTaskListAndListName(currentListUUID);
      if (!currentIsDone === true) {
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
   *
   * calls updateTask defined in db.js then it calls getTaskListAndListName defined in app.js which gets all the tasks and name of a particular list
   * @param {*} event
   */
  async function handleTaskUpdate(event) {
    try {
      if (event.keyCode === ENTER_KEY_CODE) {
        let newInnerText = event.target.innerText;
        await updateTask(task_id, newInnerText);
        await getTaskListAndListName(currentListUUID);
        setIsTaskItemEditable(false);
      }
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   *
   * calls deleteTask defined in db.js then calls getTaskListAndListName defined in app.js which gets all the tasks and name of a particular list
   */
  async function handleTaskDeletion() {
    try {
      await deleteTask(task_id, RECYCLE_BIN_LIST.id);
      await getTaskListAndListName(currentListUUID);
    } catch (error) {
      modalButtonRef.current.click();
    }
    setIsTaskItemEditable(false);
  }

  /**
   *
   * taskInfo contains unique id of task, id of list it belongs to, is_done property, metadata which contains text of task and id of list it belongs to initially, date of creation and deleted property to see whether it is deleted or not.
   */
  
  return (
    <>
      <div
        className={`task-item ${
          appBodyTheme === THEME.DARK.name && THEME.DARK.className
        }`}
        style={{
          textDecoration: taskInfo.is_done === true ? "line-through" : "none",
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
        <div className="taskItem-text">{text}</div>
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
