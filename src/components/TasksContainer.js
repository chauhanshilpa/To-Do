import React from "react";
import TaskItem from "./TaskItem";

const TasksContainer = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    currentList_uuid,
    taskListsJSON,
    setTaskListsJSON,
  } = props;

  return (
    <div
      className={`task-container-wrapper ${sidebarOpenState && "open-sidebar"}`}
    >
      <div className={`container tasks-container`}>
        {taskListsJSON[currentList_uuid]["list"].map(
          (task, taskIndex) => (
            <TaskItem
              key={task.uuid}
              taskIndex={taskIndex}
              appBodyTheme={appBodyTheme}
              currentList_uuid={currentList_uuid}
              currentListTask={task}
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
