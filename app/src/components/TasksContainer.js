import React from "react";
import { v4 as uuidv4 } from "uuid";
import TaskItem from "./TaskItem";

const TasksContainer = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    currentList_uuid,
    taskList,
    setTaskList,
  } = props;

  return (
    <div
      className={`task-container-wrapper ${sidebarOpenState && "open-sidebar"}`}
    >
      <div className={`container tasks-container`}>
        {taskList.length > 0 &&
          taskList.map((task, taskIndex) => (
            <TaskItem
              key={uuidv4()}
              taskIndex={taskIndex}
              appBodyTheme={appBodyTheme}
              currentList_uuid={currentList_uuid}
              currentListTask={task}
              setTaskList={setTaskList}
            />
          ))}
      </div>
    </div>
  );
};

export default TasksContainer;
