import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TasksInputField from "./components/TasksInputField";
import TasksContainer from "./components/TasksContainer";
import { v4 as uuidv4 } from "uuid";
import RecycleBinTasksContainer from "./components/RecycleBinTasksContainer";

function App() {
  const [appBodyTheme, setAppBodyTheme] = useState("light");
  const [inputTask, setInputTask] = useState("");
  const [sidebarOpenState, setSidebarOpenState] = useState(false);
  const [sidebarTaskListName, setSidebarTaskListName] = useState("");
  const [current_uuid, setCurrent_uuid] = useState("my_day");
  const [sidebarDynamicListNameAndUuids, setSidebarDynamicListNameAndUuids] =
    useState([]);
  const [taskListsJSON, setTaskListsJSON] = useState({
    my_day: {
      taskList: [],
      metadata: {
        listName: "my_day",
        pathName: "my_day",
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
    setSidebarTaskListName(event.target.value);
  }

  function handlePredefinedListUuid() {
    let pathname = window.location.pathname;
    let uuid = pathname.slice(1);
    setCurrent_uuid(uuid);
  }

  function handleNewSidebarList(event) {
    if (event.keyCode === 13) {
      if (sidebarTaskListName.trim().length !== 0) {
        setSidebarTaskListName("");
        const listUuid = uuidv4();
        let newTaskListsJSON = { ...taskListsJSON };
        setTaskListsJSON({
          ...newTaskListsJSON,
          [listUuid]: {
            taskList: [],
            metadata: {
              listName: sidebarTaskListName,
              pathName: listUuid,
              deletable: true,
            },
          },
        });
        setSidebarDynamicListNameAndUuids(
          sidebarDynamicListNameAndUuids.concat({
            listUuid: listUuid,
            sidebarTaskListName: sidebarTaskListName,
          })
        );
      }
    }
  }

  function onClickingSidebarList(listIndex) {
    let listUuid = sidebarDynamicListNameAndUuids[listIndex].listUuid;
    setCurrent_uuid(listUuid);
  }

  function handleSidebarDynamicListDeletion(listIndex) {
    let newSidebarDynamicListNameAndUuids = [...sidebarDynamicListNameAndUuids];
    newSidebarDynamicListNameAndUuids.splice(listIndex, 1);
    setSidebarDynamicListNameAndUuids(newSidebarDynamicListNameAndUuids);
  }

  return (
    <>
      <BrowserRouter>
        <Navbar
          handleLightAndDarkMode={handleLightAndDarkMode}
          appBodyTheme={appBodyTheme}
        />
        {sidebarOpenState && (
          <Sidebar
            appBodyTheme={appBodyTheme}
            sidebarOpenState={sidebarOpenState}
            handlePredefinedListUuid={handlePredefinedListUuid}
            sidebarTaskListName={sidebarTaskListName}
            handleSidebarListChange={handleSidebarListChange}
            handleNewSidebarList={handleNewSidebarList}
            sidebarDynamicListNameAndUuids={sidebarDynamicListNameAndUuids}
            onClickingSidebarList={onClickingSidebarList}
            handleSidebarDynamicListDeletion={handleSidebarDynamicListDeletion}
          />
        )}
        <Header
          appBodyTheme={appBodyTheme}
          toggleSidebarOpenState={toggleSidebarOpenState}
          sidebarOpenState={sidebarOpenState}
          listName={taskListsJSON[current_uuid]["metadata"]["listName"]}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/my_day" />} />
          <Route
            exact
            path="/recycle_bin"
            element={
              <>
                <RecycleBinTasksContainer
                  appBodyTheme={appBodyTheme}
                  sidebarOpenState={sidebarOpenState}
                  taskListsJSON={taskListsJSON}
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
                  appBodyTheme={appBodyTheme}
                  inputTask={inputTask}
                  handleInputTaskChange={handleInputTaskChange}
                  handleInputTaskKeypress={handleInputTaskKeypress}
                  sidebarOpenState={sidebarOpenState}
                />
                <TasksContainer
                  key={current_uuid}
                  appBodyTheme={appBodyTheme}
                  sidebarOpenState={sidebarOpenState}
                  current_uuid={current_uuid}
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
