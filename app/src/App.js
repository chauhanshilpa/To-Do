import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TasksInputField from "./components/TasksInputField";
import TasksContainer from "./components/TasksContainer";
import RecycleBinTasksContainer from "./components/RecycleBinTasksContainer";
import axios from "axios";

function App() {
  const [appBodyTheme, setAppBodyTheme] = useState("light");
  const [inputTask, setInputTask] = useState("");
  const [sidebarOpenState, setSidebarOpenState] = useState(false);
  const [sidebarTaskListName, setSidebarTaskListName] = useState("");
  const [currentListUUID, setCurrentListUUID] = useState("my_day");
  const [sidebarDynamicList, setSidebarDynamicList] = useState([]);
  const [currentListMetadata, setCurrentListMetadata] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [recycleBinTaskList, setRecycleBinTaskList] = useState([]);

  const baseURL = process.env.REACT_APP_API_BASIC_URL;

  useEffect(() => {
    getSidebarDynamicList();
    getTaskListandMetadata("my_day");
    // eslint-disable-next-line
  }, []);

  async function getTaskListandMetadata(path) {
    let response = await axios.get(`${baseURL}/list/${path}`);
    setCurrentListMetadata(response.data.metadata);
    setTaskList(response.data.taskList);
    path === "recycle_bin" &&
      setRecycleBinTaskList(response.data.recycleBinTaskList);
    setCurrentListUUID(path);
  }

  async function getSidebarDynamicList() {
    const response = await axios(`${baseURL}/list`);
    setSidebarDynamicList(response.data.sidebarDynamicList);
  }

  function onPredefinedListClick() {
    let pathUUID = window.location.pathname.slice(1);
    setCurrentListUUID(pathUUID);
    getTaskListandMetadata(pathUUID);
  }

  function onDynamicListClick(pathUUID) {
    setCurrentListUUID(pathUUID);
    getTaskListandMetadata(pathUUID);
  }

  function handleLightAndDarkMode() {
    if (appBodyTheme === "light") {
      setAppBodyTheme("dark");
      document.body.style.backgroundColor = "#343A40";
    } else {
      setAppBodyTheme("light");
      document.body.style.backgroundColor = "#FFFFFF";
    }
  }

  function toggleSidebarOpenState() {
    setSidebarOpenState(!sidebarOpenState);
  }

  function handleInputTaskChange(event) {
    setInputTask(event.target.value);
  }

  async function addTask(event) {
    if (event.keyCode === 13) {
      if (inputTask.trim().length !== 0) {
        const response = await axios.get(`${baseURL}/create_task`, {
          params: {
            currentListUUID: JSON.stringify(currentListUUID),
            inputTask,
          },
        });
        setTaskList(response.data.taskList);
        setInputTask("");
      }
    }
  }

  function handleSidebarListChange(event) {
    setSidebarTaskListName(event.target.value);
  }

  async function addNewSidebarList(event) {
    if (event.keyCode === 13) {
      if (sidebarTaskListName.trim().length !== 0) {
        const response = await axios.get(`${baseURL}/add_list`, {
          params: {
            sidebarTaskListName,
          },
        });
        setSidebarTaskListName("");
        setSidebarDynamicList(response.data.sidebarDynamicList);
      }
    }
  }

  async function deleteSidebarDynamicList(listIndex) {
    const response = await axios.get(`${baseURL}/delete_list`, {
      params: {
        listIndex: JSON.stringify(listIndex),
      },
    });
    let pathName = window.location.pathname;
    let pathUUID = pathName.slice(1);
    if (pathUUID === sidebarDynamicList[listIndex].uuid) {
      if (listIndex === 0) {
        pathUUID = "my_day";
      } else {
        pathUUID = sidebarDynamicList[listIndex - 1].uuid;
      }
      setCurrentListUUID(pathUUID);
      getTaskListandMetadata(pathUUID)
    }
    setSidebarDynamicList(response.data.sidebarDynamicList);
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
            onPredefinedListClick={onPredefinedListClick}
            onDynamicListClick={onDynamicListClick}
            sidebarTaskListName={sidebarTaskListName}
            handleSidebarListChange={handleSidebarListChange}
            addNewSidebarList={addNewSidebarList}
            sidebarDynamicList={sidebarDynamicList}
            deleteSidebarDynamicList={deleteSidebarDynamicList}
          />
        )}
        <Header
          appBodyTheme={appBodyTheme}
          toggleSidebarOpenState={toggleSidebarOpenState}
          sidebarOpenState={sidebarOpenState}
          listName={currentListMetadata.listName}
        />
        <Routes>
          <Route
            exact
            path={"/:currentListUUID"}
            element={
              <>
                <TasksInputField
                  appBodyTheme={appBodyTheme}
                  inputTask={inputTask}
                  handleInputTaskChange={handleInputTaskChange}
                  addTask={addTask}
                  sidebarOpenState={sidebarOpenState}
                />
                <TasksContainer
                  key={currentListUUID}
                  appBodyTheme={appBodyTheme}
                  sidebarOpenState={sidebarOpenState}
                  currentListUUID={currentListUUID}
                  taskList={taskList}
                  setTaskList={setTaskList}
                />
              </>
            }
          />
          <Route path="/" element={<Navigate to="/my_day" />} />
          <Route
            exact
            path="/recycle_bin"
            element={
              <>
                <RecycleBinTasksContainer
                  appBodyTheme={appBodyTheme}
                  sidebarOpenState={sidebarOpenState}
                  recycleBinTaskList={recycleBinTaskList}
                  setRecycleBinTaskList={setRecycleBinTaskList}
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
