import React from "react";
import TaskItem from "./TaskItem";

/**
 * 
 * @param {*} props 
 * @returns a container which contains list of tasks
 */
const TasksContainer = (props) => {
  const {
    appBodyTheme,
    modalButtonRef,
    sidebarOpenState,
    currentListUUID,
    taskList,
    setTaskList,
  } = props;

  return (
    <div
      className={`task-container-wrapper ${sidebarOpenState && "open-sidebar"}`}
    >
      <div className={`container tasks-container`}>
        {taskList.length > 0 &&
          taskList.map((taskInfo, taskIndex) => (
            <TaskItem
              key={taskInfo.uuid}
              taskIndex={taskIndex}
              appBodyTheme={appBodyTheme}
              modalButtonRef={modalButtonRef}
              currentListUUID={currentListUUID}
              taskInfo={taskInfo}
              setTaskList={setTaskList}
            />
          ))}
      </div>
    </div>
  );
};

export default TasksContainer;
