import React from "react";
import TaskItem from "./TaskItem";

/**
 * @param {*} props
 * @returns a container containing list of tasks of respective sidebar lists.
 */
const TasksContainer = (props) => {
  const {
    appBodyTheme,
    modalButtonRef,
    sidebarOpenState,
    predefinedList,
    currentListUUID,
    taskList,
    getTaskListAndListName,
  } = props;

  return (
    <div
      className={`task-container-wrapper ${sidebarOpenState && "open-sidebar"}`}
    >
      <div className={`container tasks-container`}>
        {taskList.length > 0 &&
          taskList.map((taskInfo) => (
            <TaskItem
              key={taskInfo.task_id}
              appBodyTheme={appBodyTheme}
              modalButtonRef={modalButtonRef}
              predefinedList={predefinedList}
              currentListUUID={currentListUUID}
              taskInfo={taskInfo}
              getTaskListAndListName={getTaskListAndListName}
            />
          ))}
      </div>
    </div>
  );
};

export default TasksContainer;
