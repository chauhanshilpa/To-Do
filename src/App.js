import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import TasksInputField from "./components/TasksInputField";
import TasksContainer from "./components/TasksContainer";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [inputTask, setInputTask] = useState("");
  const [sidebarListName, setSidebarListName] = useState("");
  const [sidebarList, setSidebarList] = useState([]);
  const [current_uuid, setCurrent_uuid] = useState("home_tasks");
  const [sidebarListUuids, setSidebarListUuids] = useState([]);
  const [taskListsJSON, setTaskListsJSON] = useState({
    home_tasks: {
      taskList: [],
      metadata: {
        listName: sidebarListName,
        deletable: true,
      },
    },
  });
  const [sidebarOpenState, setSidebarOpenState] = useState(false);

  function handleInputTaskChange(event) {
    setInputTask(event.target.value);
  }

  function handleInputTaskKeypress(e) {
    if (e.keyCode === 13) {
      let newTaskListsJSON = { ...taskListsJSON };
      newTaskListsJSON[current_uuid]["taskList"] =
        newTaskListsJSON[current_uuid]["taskList"].concat(inputTask);
      setTaskListsJSON(newTaskListsJSON);
      setInputTask("");
    }
  }

  function handleSidebarListChange(event) {
    setSidebarListName(event.target.value);
  }

  function handleNewSidebarList(e) {
    if (e.keyCode === 13) {
      setSidebarList(sidebarList.concat(sidebarListName));
      setSidebarListName("");

      const myuuid = uuidv4();
      let newTaskListsJSON = { ...taskListsJSON };
      setTaskListsJSON({
        ...newTaskListsJSON,
        [myuuid]: {
          taskList: [],
          metadata: {
            listName: sidebarListName,
            deletable: true,
          },
        },
      });
      setSidebarListUuids(sidebarListUuids.concat(myuuid));
    }
  }

  function onClickingSidebarList(index) {
    setCurrent_uuid(sidebarListUuids[index]);
  }

  function toggleSidebarOpenState() {
    setSidebarOpenState(!sidebarOpenState);
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Header
          sidebarListName={sidebarListName}
          sidebarList={sidebarList}
          setSidebarList={setSidebarList}
          handleSidebarListChange={handleSidebarListChange}
          handleNewSidebarList={handleNewSidebarList}
          onClickingSidebarList={onClickingSidebarList}
          sidebarListUuids={sidebarListUuids}
          toggleSidebarOpenState={toggleSidebarOpenState}
          sidebarOpenState={sidebarOpenState}
        />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <TasksInputField
                  inputTask={inputTask}
                  handleInputTaskChange={handleInputTaskChange}
                  handleInputTaskKeypress={handleInputTaskKeypress}
                  sidebarOpenState={sidebarOpenState}
                />
                <TasksContainer
                  key="home_tasks"
                  current_uuid="home_tasks"
                  taskListsJSON={taskListsJSON}
                  setTaskListsJSON={setTaskListsJSON}
                  sidebarOpenState={sidebarOpenState}
                />
              </>
            }
          />
          <Route
            exact
            path={current_uuid}
            element={
              <>
                <TasksInputField
                  inputTask={inputTask}
                  handleInputTaskChange={handleInputTaskChange}
                  handleInputTaskKeypress={handleInputTaskKeypress}
                  sidebarOpenState={sidebarOpenState}
                />
                <TasksContainer
                  key={current_uuid}
                  current_uuid={current_uuid}
                  taskListsJSON={taskListsJSON}
                  setTaskListsJSON={setTaskListsJSON}
                  sidebarOpenState={sidebarOpenState}
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
