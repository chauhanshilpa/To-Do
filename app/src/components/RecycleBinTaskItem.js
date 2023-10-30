import React from "react";
import { THEME, RECYCLE_BIN_LIST } from "../Constants";
import { restoreTaskFromRecycleBin, deleteTaskFromRecycleBin } from "../api";
import { Tooltip } from "react-tooltip";

/**
 *
 * @param {*} props
 * @returns task items which presents in Recycle Bin
 */
const RecycleBinTaskItem = (props) => {
  const { taskInfo, modalButtonRef, appBodyTheme, getTaskListAndListName } =
    props;

  const { task_id } = taskInfo;
  const { text } = taskInfo.metadata;

  /**
   *
   *calls restoreTaskFromRecycleBin defined in db.js then calls getTaskListAndListName to get name of list and updated task list of recycle bin
   */
  async function handleTaskRestoration() {
    const root_list_id = taskInfo.metadata.root_list_id;
    try {
      await restoreTaskFromRecycleBin(task_id, root_list_id);
      await getTaskListAndListName(RECYCLE_BIN_LIST.id);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   *
   * calls deleteTaskFromRecycleBin defined in db.js then calls getTaskListAndListName to get name of list and updated task list of recycle bin
   */
  async function handleTaskPermanentDeletion() {
    try {
      await deleteTaskFromRecycleBin(task_id);
      await getTaskListAndListName(RECYCLE_BIN_LIST.id);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   *
   * taskInfo contains unique id of task, id of list it belongs to, is_done property, metadata which contains text of task and id of list it belongs to initially, date of creation and deleted property to see whether it is deleted or not.
   */
  return (
    <div
      className={`task-item ${
        appBodyTheme === THEME.DARK.name && THEME.DARK.className
      }`}
    >
      <div className="taskItem-text">{text}</div>
      <div className="restore-and-delete-buttons">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-counterclockwise"
          viewBox="0 0 16 16"
          onClick={handleTaskRestoration}
          data-tooltip-id="restore-task"
          data-tooltip-content="Restore"
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
        </svg>
        <Tooltip className="tooltip" id="restore-task" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-trash3"
          viewBox="0 0 16 16"
          onClick={handleTaskPermanentDeletion}
          data-tooltip-id="permanent-delete"
          data-tooltip-content="Delete"
        >
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
        </svg>
        <Tooltip className="tooltip" id="permanent-delete" />
      </div>
    </div>
  );
};

export default RecycleBinTaskItem;
