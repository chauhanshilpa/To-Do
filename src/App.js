import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import InputField from "./components/InputField";
import TasksContainer from "./components/TasksContainer";

function App() {
  const [inputTask, setInputTask] = useState("");
  const [taskListsJSON, setTaskListsJSON] = useState({ tasks: [] });
  const [sidebarListName, setSidebarListName] = useState("");
  const [sidebarList, setSidebarList] = useState([]);
  const [currentListName, setCurrentListName] = useState("tasks");

  function handleInputTaskChange(event) {
    setInputTask(event.target.value);
  }

  const handleInputFieldKeypress = (e) => {
    if (e.keyCode === 13) {
      let newTaskListsJSON = taskListsJSON;
      newTaskListsJSON[currentListName] =
        newTaskListsJSON[currentListName].concat(inputTask);
      setTaskListsJSON(newTaskListsJSON);
      setInputTask("");
    }
  };

  function handleSidebarListName(event) {
    setSidebarListName(event.target.value);
  }

  function handleSidebarListKeypress(e) {
    if (e.keyCode === 13) {
      setSidebarList(sidebarList.concat(sidebarListName));
      setSidebarListName("");
    }
  }

  function onClickingSidebarList(listName) {
    setCurrentListName(listName);
    if (!taskListsJSON.hasOwnProperty(listName)) {
      let newTaskListsJSON = { ...taskListsJSON, [listName]: [] };
      setTaskListsJSON(newTaskListsJSON);
    }
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Header
          sidebarListName={sidebarListName}
          sidebarList={sidebarList}
          handleSidebarListName={handleSidebarListName}
          handleSidebarListKeypress={handleSidebarListKeypress}
          onClickingSidebarList={onClickingSidebarList}
        />
        <Routes>
          <Route
            key="tasks"
            exact
            path="/"
            element={
              <>
                <InputField
                  inputTask={inputTask}
                  handleInputTaskChange={handleInputTaskChange}
                  handleInputFieldKeypress={handleInputFieldKeypress}
                />
                <TasksContainer
                  key="tasks"
                  currentListName="tasks"
                  taskListsJSON={taskListsJSON}
                  setTaskListsJSON={setTaskListsJSON}
                />
              </>
            }
          />
          <Route
            exact
            path={currentListName}
            element={
              <>
                <InputField
                  inputTask={inputTask}
                  handleInputTaskChange={handleInputTaskChange}
                  handleInputFieldKeypress={handleInputFieldKeypress}
                />
                <TasksContainer
                  key={currentListName}
                  currentListName={currentListName}
                  taskListsJSON={taskListsJSON}
                  setTaskListsJSON={setTaskListsJSON}
                />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
