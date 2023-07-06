import React from "react";
import TaskItem from "./TaskItem";

const TasksContainer = (props) => {
  const { taskListsJSON, setTaskListsJSON, currentListName } = props;

  return (
    <>
      <div className="container tasks-container d-grid gap-2">
        {taskListsJSON[currentListName].map((currentListTask, index) => (
          <TaskItem
            key={index}
            currentListTask={currentListTask}
            taskListsJSON={taskListsJSON}
            setTaskListsJSON={setTaskListsJSON}
            currentListName={currentListName}
            taskListIndex={index}
          />
        ))}
      </div>
    </>
  );
};

export default TasksContainer;
