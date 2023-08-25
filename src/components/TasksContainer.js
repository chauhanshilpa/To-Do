import React from "react";
import TaskItem from "./TaskItem";

const TasksContainer = (props) => {
  const { taskListsJSON, setTaskListsJSON, current_uuid, sidebarOpenState } =
    props;

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
              currentListTaskObject={innerTextAndTaskUuidObject}
              taskListsJSON={taskListsJSON}
              setTaskListsJSON={setTaskListsJSON}
              current_uuid={current_uuid}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TasksContainer;
