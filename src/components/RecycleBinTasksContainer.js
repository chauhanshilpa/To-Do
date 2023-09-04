import React from "react";
import RecycleBinTaskItem from "./RecycleBinTaskItem";

const RecycleBinTasks = (props) => {
  const { appBodyTheme, sidebarOpenState, taskListsJSON, setTaskListsJSON } =
    props;

  return (
    <div
      className={`recycle-bin-container-wrapper ${
        sidebarOpenState && "open-sidebar"
      }`}
    >
      <div className="container tasks-container">
        {taskListsJSON["recycle_bin"]["list"].length > 0 ? (
          taskListsJSON["recycle_bin"]["list"].map(
            (taskObjectWithPathName, objectIndex) => (
              <RecycleBinTaskItem
                key={objectIndex}
                objectIndex={objectIndex}
                taskObjectWithPathName={taskObjectWithPathName}
                appBodyTheme={appBodyTheme}
                taskListsJSON={taskListsJSON}
                setTaskListsJSON={setTaskListsJSON}
              />
            )
          )
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
