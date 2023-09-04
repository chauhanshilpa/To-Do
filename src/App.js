import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TasksInputField from "./components/TasksInputField";
import {
  TasksList,
  TasksListMetadata,
  Task,
  SidebarDynamicList,
} from "./components/ClassModels";
import TasksContainer from "./components/TasksContainer";
import { v4 as uuidv4 } from "uuid";
import RecycleBinTasksContainer from "./components/RecycleBinTasksContainer";

function App() {
  const [appBodyTheme, setAppBodyTheme] = useState("light");
  const [inputTask, setInputTask] = useState("");
  const [sidebarOpenState, setSidebarOpenState] = useState(false);
  const [sidebarTaskListName, setSidebarTaskListName] = useState("");
  const [currentList_uuid, setCurrentList_uuid] = useState("my_day");
  const [sidebarDynamicList, setSidebarDynamicList] = useState([]);
  const [taskListsJSON, setTaskListsJSON] = useState({
    my_day: new TasksList(new TasksListMetadata("My Day", "my_day", false)),
    recycle_bin: new TasksList(
      new TasksListMetadata("Recycle Bin", "recycle_bin", false)
    ),
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
        newTaskListsJSON[currentList_uuid]["list"].push(
          new Task(taskUuid, inputTask, false)
        );
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
    setCurrentList_uuid(uuid);
  }

  function handleNewSidebarList(event) {
    if (event.keyCode === 13) {
      if (sidebarTaskListName.trim().length !== 0) {
        setSidebarTaskListName("");
        const listUuid = uuidv4();
        let newTaskListsJSON = { ...taskListsJSON };
        newTaskListsJSON[listUuid] = new TasksList(
          new TasksListMetadata(sidebarTaskListName, listUuid, true)
        );
        setTaskListsJSON(newTaskListsJSON);
        let newSidebarDynamicList = [...sidebarDynamicList]
        newSidebarDynamicList.push(
          new SidebarDynamicList(listUuid, sidebarTaskListName)
        );
        setSidebarDynamicList(newSidebarDynamicList);
      }
    }
  }

  function onClickingSidebarList(listIndex) {
    let listUuid = sidebarDynamicList[listIndex].uuid;
    setCurrentList_uuid(listUuid);
  }

  function handleSidebarDynamicListDeletion(listIndex) {
    if (listIndex === 0) {
      setCurrentList_uuid("my_day");
    } else if (
      window.location.pathname.slice(1) ===
      sidebarDynamicList[listIndex].uuid
    ) {
      setCurrentList_uuid(sidebarDynamicList[listIndex - 1].uuid);
    }
    let newSidebarDynamicList = [...sidebarDynamicList];
    newSidebarDynamicList.splice(listIndex, 1);
    setSidebarDynamicList(newSidebarDynamicList);
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
            sidebarDynamicList={sidebarDynamicList}
            onClickingSidebarList={onClickingSidebarList}
            handleSidebarDynamicListDeletion={handleSidebarDynamicListDeletion}
          />
        )}
        <Header
          appBodyTheme={appBodyTheme}
          toggleSidebarOpenState={toggleSidebarOpenState}
          sidebarOpenState={sidebarOpenState}
          listName={taskListsJSON[currentList_uuid]["metadata"]["listName"]}
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
            path={currentList_uuid}
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
                  key={currentList_uuid}
                  appBodyTheme={appBodyTheme}
                  sidebarOpenState={sidebarOpenState}
                  currentList_uuid={currentList_uuid}
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
