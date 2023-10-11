import React from "react";
import RecycleBinTaskItem from "./RecycleBinTaskItem";

/**
 *
 * @param {*} props
 * @returns a container which contains list of task in Recycle Bin. If there is no task, a alert will be displayed
 */
const RecycleBinTasks = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    modalButtonRef,
    recycleBinTaskList,
    setRecycleBinTaskList,
  } = props;

  return (
    <div
      className={`recycle-bin-container-wrapper ${
        sidebarOpenState && "open-sidebar"
      }`}
    >
      <div className="container tasks-container">
        {recycleBinTaskList.length > 0 ? (
          recycleBinTaskList.map((listItemInfo, index) => (
            <RecycleBinTaskItem
              key={listItemInfo.task.uuid}
              objectIndex={index}
              listItemInfo={listItemInfo}
              appBodyTheme={appBodyTheme}
              modalButtonRef={modalButtonRef}
              setRecycleBinTaskList={setRecycleBinTaskList}
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
