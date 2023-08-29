import React from "react";
import TaskItem from "./TaskItem";

const TasksContainer = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    current_uuid,
    taskListsJSON,
    setTaskListsJSON,
  } = props;

  return (
    <div
      className={`task-container-wrapper ${sidebarOpenState && "open-sidebar"}`}
    >
      <div className={`container tasks-container`}>
        {taskListsJSON[current_uuid]["taskList"].map(
          (innerTextAndTaskUuidObject, taskIndex) => (
            <TaskItem
              key={innerTextAndTaskUuidObject.taskUuid}
              taskIndex={taskIndex}
              appBodyTheme={appBodyTheme}
              current_uuid={current_uuid}
              currentListTaskObject={innerTextAndTaskUuidObject}
              taskListsJSON={taskListsJSON}
              setTaskListsJSON={setTaskListsJSON}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TasksContainer;
