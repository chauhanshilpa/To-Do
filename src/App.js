import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import TasksInputField from "./components/TasksInputField";
import TasksContainer from "./components/TasksContainer";
import { v4 as uuidv4 } from "uuid";
import RecycleBinTasksContainer from "./components/RecycleBinTasksContainer";

function App() {
  const [appBodyTheme, setAppBodyTheme] = useState("light");
  const [inputTask, setInputTask] = useState("");
  const [sidebarListName, setSidebarListName] = useState("");
  const [sidebarList, setSidebarList] = useState([]);
  const [current_uuid, setCurrent_uuid] = useState("tasks");
  const [sidebarListUuids, setSidebarListUuids] = useState([]);
  const [taskListsJSON, setTaskListsJSON] = useState({
    tasks: {
      taskList: [],
      metadata: {
        listName: "tasks",
        pathName: "tasks",
        deletable: true,
      },
    },
    recycle_bin: {
      taskList: [],
      metadata: {
        listName: "recycle_bin",
        pathName: "recycle_bin",
        deletable: true,
      },
    },
  });
  const [sidebarOpenState, setSidebarOpenState] = useState(false);

  function handleLightAndDarkMode() {
    if (appBodyTheme === "light") {
      setAppBodyTheme("dark");
      document.body.style.backgroundColor = "#343A40";
    } else {
      setAppBodyTheme("light");
      document.body.style.backgroundColor = "#FFFFFF";
    }
  }

  function handleInputTaskChange(event) {
    setInputTask(event.target.value);
  }

  function handleInputTaskKeypress(e) {
    if (e.keyCode === 13) {
      if (inputTask.trim().length !== 0) {
        const taskUuid = uuidv4();
        let newTaskListsJSON = { ...taskListsJSON };
        newTaskListsJSON[current_uuid]["taskList"] = newTaskListsJSON[
          current_uuid
        ]["taskList"].concat({
          taskUuid: taskUuid,
          innerText: inputTask,
          date: new Date().toDateString(),
          taskDone: false,
        });
        setTaskListsJSON(newTaskListsJSON);
        setInputTask("");
      }
    }
  }

  function toggleSidebarOpenState() {
    setSidebarOpenState(!sidebarOpenState);
  }

  function handleSidebarListChange(event) {
    setSidebarListName(event.target.value);
  }

  function handleNewSidebarList(e) {
    if (e.keyCode === 13) {
      if (sidebarListName.trim().length !== 0) {
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
              pathName: myuuid,
              deletable: true,
            },
          },
        });
        setSidebarListUuids(sidebarListUuids.concat(myuuid));
      }
    }
  }

  function onClickingSidebarList(index) {
    setCurrent_uuid(sidebarListUuids[index]);
  }

  function handlePredefinedListUuid() {
    let pathname = window.location.pathname;
    let uuid = pathname.slice(1);
    setCurrent_uuid(uuid);
  }

  return (
    <>
      <BrowserRouter>
        <Navbar
          handleLightAndDarkMode={handleLightAndDarkMode}
          appBodyTheme={appBodyTheme}
        />
        <Header
          appBodyTheme={appBodyTheme}
          sidebarListName={sidebarListName}
          sidebarList={sidebarList}
          setSidebarList={setSidebarList}
          handleSidebarListChange={handleSidebarListChange}
          handleNewSidebarList={handleNewSidebarList}
          onClickingSidebarList={onClickingSidebarList}
          sidebarListUuids={sidebarListUuids}
          toggleSidebarOpenState={toggleSidebarOpenState}
          sidebarOpenState={sidebarOpenState}
          handlePredefinedListUuid={handlePredefinedListUuid}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route
            exact
            path="/tasks"
            element={
              <>
                <TasksInputField
                  inputTask={inputTask}
                  handleInputTaskChange={handleInputTaskChange}
                  handleInputTaskKeypress={handleInputTaskKeypress}
                  sidebarOpenState={sidebarOpenState}
                />
                <TasksContainer
                  key="tasks"
                  current_uuid="tasks"
                  taskListsJSON={taskListsJSON}
                  setTaskListsJSON={setTaskListsJSON}
                  sidebarOpenState={sidebarOpenState}
                />
              </>
            }
          />
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route
            exact
            path="/recycle_bin"
            element={
              <>
                <RecycleBinTasksContainer
                  taskListsJSON={taskListsJSON}
                  sidebarOpenState={sidebarOpenState}
                  setTaskListsJSON={setTaskListsJSON}
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
