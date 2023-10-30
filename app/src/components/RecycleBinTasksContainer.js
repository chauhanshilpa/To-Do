import React from "react";
import RecycleBinTaskItem from "./RecycleBinTaskItem";

/**
 *
 * @param {*} props
 * @returns a container which contains list of tasks in Recycle Bin. If there is no task, a alert will be displayed
 */
const RecycleBinTasks = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    modalButtonRef,
    recycleBinTaskList,
    getTaskListAndListName,
  } = props;

  return (
    <div
      className={`recycle-bin-container-wrapper ${
        sidebarOpenState && "open-sidebar"
      }`}
    >
      <div className="container tasks-container">
        {recycleBinTaskList.length > 0 ? (
          recycleBinTaskList.map((taskInfo, index) => (
            <RecycleBinTaskItem
              key={taskInfo.task_id}
              taskInfo={taskInfo}
              appBodyTheme={appBodyTheme}
              modalButtonRef={modalButtonRef}
              getTaskListAndListName={getTaskListAndListName}
            />
          ))
        ) : (
          <div className="alert alert-dark fs-5" role="alert">
            Recycle Bin is empty. No tasks to display!
          </div>
        )}
      </div>
    </div>
  );
};

export default RecycleBinTasks;
