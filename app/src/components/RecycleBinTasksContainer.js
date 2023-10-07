import React from "react";
import { v4 as uuidv4 } from "uuid";
import RecycleBinTaskItem from "./RecycleBinTaskItem";

const RecycleBinTasks = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
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
              key={uuidv4()}
              objectIndex={index}
              listItemInfo={listItemInfo}
              appBodyTheme={appBodyTheme}
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
