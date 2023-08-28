import React from "react";

const RecycleBinTaskItem = (props) => {
  const {
    appBodyTheme,
    taskListsJSON,
    setTaskListsJSON,
    taskObjectWithPathName,
    objectIndex,
  } = props;

  function handlePermanentDeletion(objectIndex) {
    let newTaskListJSON = { ...taskListsJSON };
    newTaskListJSON["recycle_bin"]["taskList"].splice(objectIndex, 1);
    setTaskListsJSON(newTaskListJSON);
  }

  function handleTaskRestoration(objectIndex) {
    let newTaskListJSON = { ...taskListsJSON };
    // elementToRestore is a object having path name of current list as key and its value is a object containing metadata of every single task.
    let elementToRestore = newTaskListJSON["recycle_bin"]["taskList"].splice(
      objectIndex,
      1
    );
    let pathNameOfList = Object.keys(elementToRestore[0]).toString();
    let restoredTaskObject = elementToRestore[0][pathNameOfList];
    newTaskListJSON[pathNameOfList]["taskList"] =
      newTaskListJSON[pathNameOfList]["taskList"].concat(restoredTaskObject);
    setTaskListsJSON(newTaskListJSON);
  }

  return (
    <div className={`task-item ${appBodyTheme === "dark" && "theme-dark"}`}>
      <div
        className="taskItem-text"
        style={{
          textDecoration:
            Object.values(taskObjectWithPathName)[0].taskDone && "line-through",
        }}
      >
        {Object.values(taskObjectWithPathName)[0].innerText}
      </div>
      <div className="restore-and-delete-buttons">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-counterclockwise"
          viewBox="0 0 16 16"
          onClick={() => handleTaskRestoration(objectIndex)}
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-trash3"
          viewBox="0 0 16 16"
          onClick={() => handlePermanentDeletion(objectIndex)}
        >
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
        </svg>
      </div>
    </div>
  );
};

export default RecycleBinTaskItem;