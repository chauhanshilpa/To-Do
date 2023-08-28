import React from "react";
import RecycleBinTaskItem from "./RecycleBinTaskItem";

const RecycleBinTasks = (props) => {
  const { appBodyTheme, taskListsJSON, setTaskListsJSON, sidebarOpenState } =
    props;

  return (
    <div
      className={`recycle-bin-container-wrapper ${
        sidebarOpenState && "open-sidebar"
      }`}
    >
      <div className="container tasks-container">
        {taskListsJSON["recycle_bin"]["taskList"].length > 0 ? (
          taskListsJSON["recycle_bin"]["taskList"].map(
            (taskObjectWithPathName, objectIndex) => (
              <RecycleBinTaskItem
                key={objectIndex}
                taskObjectWithPathName={taskObjectWithPathName}
                objectIndex={objectIndex}
                taskListsJSON={taskListsJSON}
                setTaskListsJSON={setTaskListsJSON}
                sidebarOpenState={sidebarOpenState}
                appBodyTheme={appBodyTheme}
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
