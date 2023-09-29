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
  const [currentList_uuid, setCurrentList_uuid] = useState("my_day");
  const [sidebarDynamicList, setSidebarDynamicList] = useState([]);
  const [currentListMetadata, setCurrentListMetadata] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [recycleBinTaskList, setRecycleBinTaskList] = useState([]);

  const baseURL = process.env.REACT_APP_API_BASIC_URL;

  useEffect(() => {
    getSidebarDynamicList();
    // eslint-disable-next-line
  }, []);

  async function getSidebarDynamicList() {
    const response = await axios(`${baseURL}/list`);
    setSidebarDynamicList(response.data.sidebarDynamicList);
  }

  function onListClick() {
    const pathName = window.location.pathname;
    setCurrentList_uuid(pathName.slice(1));
    getTaskListandMetadata(pathName.slice(1));
  }

  async function getTaskListandMetadata(path) {
    try {
      let response = await axios.get(`${baseURL}/list/${path}`);
      setCurrentListMetadata(response.data.metadata);
      setTaskList(response.data.taskList);
      path === "recycle_bin" &&
        setRecycleBinTaskList(response.data.recycleBinTaskList);
    } catch (error) {}
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
            currentList_uuid: JSON.stringify(currentList_uuid),
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
    const pathName = window.location.pathname;
    const response = await axios.get(`${baseURL}/delete_list`, {
      params: {
        currentList_uuid: JSON.stringify(currentList_uuid),
        listIndex: JSON.stringify(listIndex),
        pathName: JSON.stringify(pathName),
      },
    });
    setCurrentList_uuid(response.data.currentList_uuid);
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
            onListClick={onListClick}
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
          <Route
            exact
            path={currentList_uuid}
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
                  key={currentList_uuid}
                  appBodyTheme={appBodyTheme}
                  sidebarOpenState={sidebarOpenState}
                  currentList_uuid={currentList_uuid}
                  taskList={taskList}
                  setTaskList={setTaskList}
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
