import React from "react";
import TaskItem from "./TaskItem";

const TasksContainer = (props) => {
  const { taskListsJSON, setTaskListsJSON, current_uuid, sidebarOpenState } =
    props;

  return (
    <>
      <div
        className={`container tasks-container d-grid gap-2 ${
          sidebarOpenState && "open-sidebar"
        }`}
      >
        {taskListsJSON[current_uuid]["taskList"].map((task, index) => (
          <TaskItem
            key={index}
            currentListTask={task}
            taskListIndex={index}
            taskListsJSON={taskListsJSON}
            setTaskListsJSON={setTaskListsJSON}
            current_uuid={current_uuid}
          />
        ))}
      </div>
    </>
  );
};

export default TasksContainer;
