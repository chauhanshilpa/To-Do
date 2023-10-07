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
  const [sidebarUserGeneratedList, setSidebarUserGeneratedList] = useState([]);
  const [currentListMetadata, setCurrentListMetadata] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [recycleBinTaskList, setRecycleBinTaskList] = useState([]);

  const baseURL = process.env.REACT_APP_API_BASIC_URL;

  useEffect(() => {
    getSidebarList();
    getTaskListandMetadata("my_day");
    // eslint-disable-next-line
  }, []);

  async function getTaskListandMetadata(listUUID) {
    let response = await axios.get(`${baseURL}/list/${listUUID}`);
    setCurrentListMetadata(response.data.metadata);
    if (listUUID === "recycle_bin") {
      setRecycleBinTaskList(response.data.recycleBinTaskList);
    } else {
      setTaskList(response.data.taskList);
    }
    setCurrentListUUID(listUUID);
  }

  async function getSidebarList() {
    const response = await axios(`${baseURL}/list`);
    setSidebarUserGeneratedList(response.data.sidebarUserGeneratedList);
  }

  function onListClick(listUUID) {
    setCurrentListUUID(listUUID);
    getTaskListandMetadata(listUUID);
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

  async function handleNewTask(event) {
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

  async function handleNewSidebarList(event) {
    if (event.keyCode === 13) {
      if (sidebarTaskListName.trim().length !== 0) {
        const response = await axios.get(`${baseURL}/add_list`, {
          params: {
            sidebarTaskListName,
          },
        });
        setSidebarTaskListName("");
        setSidebarUserGeneratedList(response.data.sidebarUserGeneratedList);
      }
    }
  }

  async function handleSidebarListDeletion(listIndex) {
    const response = await axios.get(`${baseURL}/delete_list`, {
      params: {
        listIndex: JSON.stringify(listIndex),
      },
    });
    let listUUID = window.location.pathname.slice(1);
    if (listUUID === sidebarUserGeneratedList[listIndex].uuid) {
      if (listIndex === 0) {
        listUUID = "my_day";
      } else {
        listUUID = sidebarUserGeneratedList[listIndex - 1].uuid;
      }
      setCurrentListUUID(listUUID);
      getTaskListandMetadata(listUUID);
    }
    setSidebarUserGeneratedList(response.data.sidebarUserGeneratedList);
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
            handleNewSidebarList={handleNewSidebarList}
            sidebarUserGeneratedList={sidebarUserGeneratedList}
            handleSidebarListDeletion={handleSidebarListDeletion}
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
                  handleNewTask={handleNewTask}
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
          <Route path="/" element={<Navigate to="/my_day" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
