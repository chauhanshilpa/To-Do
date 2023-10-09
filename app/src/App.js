import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { theme, enterKeyCode, defaultList } from "./Constants";
import {
  addSidebarList,
  deleteSidebarList,
  addTask,
  getList,
  getListData,
} from "./api";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TasksInputField from "./components/TasksInputField";
import TasksContainer from "./components/TasksContainer";
import RecycleBinTasksContainer from "./components/RecycleBinTasksContainer";
import Modal from "./components/Modal";

function App() {
  const [appBodyTheme, setAppBodyTheme] = useState(theme.light.name);
  const [inputTask, setInputTask] = useState("");
  const [sidebarOpenState, setSidebarOpenState] = useState(false);
  const [sidebarTaskListName, setSidebarTaskListName] = useState("");
  const [currentListUUID, setCurrentListUUID] = useState(defaultList.pathName);
  const [sidebarUserGeneratedList, setSidebarUserGeneratedList] = useState([]);
  const [currentListMetadata, setCurrentListMetadata] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [recycleBinTaskList, setRecycleBinTaskList] = useState([]);

  let modalButtonRef = useRef();

  useEffect(() => {
    getSidebarList();
    getTaskListandMetadata(defaultList.pathName);
    // eslint-disable-next-line
  }, []);

  async function getSidebarList() {
    try {
      const response = await getList();
      setSidebarUserGeneratedList(response.data.sidebarUserGeneratedList);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   *
   * Returns list metadata(which containes listName, pathName of list, and if list is deleteable or not) and sets value of currentUUID.
   * @param {String} listUUID          pathName of list
   */
  async function getTaskListandMetadata(listUUID) {
    try {
      const response = await getListData(listUUID);
      setCurrentListMetadata(response.data.metadata);
      if (listUUID === "recycle_bin") {
        setRecycleBinTaskList(response.data.recycleBinTaskList);
      } else {
        setTaskList(response.data.taskList);
      }
      setCurrentListUUID(listUUID);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }
 
  /**
   * This function runs while a sidebar list is clicked
   * @param {String} listUUID          pathName of list
   */
  function onListClick(listUUID) {
    setCurrentListUUID(listUUID);
    getTaskListandMetadata(listUUID);
  }

  function handleLightAndDarkMode() {
    if (appBodyTheme === theme.light.name) {
      setAppBodyTheme(theme.dark.name);
      document.body.style.backgroundColor = theme.dark.backgroundColor;
    } else {
      setAppBodyTheme(theme.light.name);
      document.body.style.backgroundColor = theme.light.backgroundColor;
    }
  }

  function toggleSidebarOpenState() {
    setSidebarOpenState(!sidebarOpenState);
  }

  function handleInputTaskChange(event) {
    setInputTask(event.target.value);
  }

  /**
   * Add task in selected list and update taskList(list of all tasks)
   * @param {*} event 
   */
  async function handleNewTask(event) {
    if (event.keyCode === enterKeyCode) {
      if (inputTask.trim().length !== 0) {
        try {
          const response = await addTask(inputTask, currentListUUID);
          setTaskList(response.data.taskList);
        } catch (error) {
          modalButtonRef.current.click();
        }
        setInputTask("");
      }
    }
  }

  function handleSidebarListChange(event) {
    setSidebarTaskListName(event.target.value);
  }

  /**
   * Add a list and its metadata to the main json data (main json has listName, tasks in that list(this includes details of a paticular task)  and metadata about list)
   * @param {*} event 
   */
  async function handleNewSidebarList(event) {
    if (event.keyCode === enterKeyCode) {
      if (sidebarTaskListName.trim().length !== 0) {
        try {
          const response = await addSidebarList(sidebarTaskListName);
          setSidebarUserGeneratedList(response.data.sidebarUserGeneratedList);
        } catch (error) {
          modalButtonRef.current.click();
        }
        setSidebarTaskListName("");
      }
    }
  }

  /**
   * Deletes selected list and path moves to its previous list.
   * @param {Number} listIndex    
   */
  async function handleSidebarListDeletion(listIndex) {
    try {
      const response = await deleteSidebarList(listIndex);
      setSidebarUserGeneratedList(response.data.sidebarUserGeneratedList);
      let listUUID = window.location.pathname.slice(1);
      if (listUUID === sidebarUserGeneratedList[listIndex].uuid) {
        if (listIndex === 0) {
          listUUID = defaultList.pathName;
        } else {
          listUUID = sidebarUserGeneratedList[listIndex - 1].uuid;
        }
        setCurrentListUUID(listUUID);
        getTaskListandMetadata(listUUID);
      }
    } catch (error) {
      modalButtonRef.current.click();
    }
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
        <Modal modalButtonRef={modalButtonRef} />
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
                  modalButtonRef={modalButtonRef}
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
                  modalButtonRef={modalButtonRef}
                  recycleBinTaskList={recycleBinTaskList}
                  setRecycleBinTaskList={setRecycleBinTaskList}
                />
              </>
            }
          />
          <Route path="/" element={<Navigate to={defaultList.pathName} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
