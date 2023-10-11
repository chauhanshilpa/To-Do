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
    getTaskListAndMetadata(defaultList.pathName);
    // eslint-disable-next-line
  }, []);

  /**
   * calls getList function defined in api.js which fetches all lists of sidebar.
   */
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
   * calls getListData function defined in api.js and passes listUUID which fetches list metadata(which includes listName, pathName, and deletable property) and all tasks of this list.
   * @param {String} listUUID   It is the pathName of list (unique identity)
   */
  async function getTaskListAndMetadata(listUUID) {
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
   * This function runs while a sidebar list is clicked and shows all the data of that list only.
   * @param {String} listUUID   It is the pathName of list (unique identity)
   */
  function onListClick(listUUID) {
    setCurrentListUUID(listUUID);
    getTaskListAndMetadata(listUUID);
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
   * calls a function addTask defined in api.js which fetches tasks of a list.It catches the error and shows a pop up if there is a failure in api call.
   * @param {*} event
   * enterKeyCode is the keyCode of enter key. Task will be added on pressing enter key. If task has all spaces then it will not be added into the list.
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
   * calls a function addSidebarList defined in api.js which add new sidebar 
  list and its metadata to the main json data (main json has listName, tasks in that list(this includes details of a particular task) and metadata about list) and shows the new list on sidebar. It catches the error and shows a pop up if there is a failure in api call.
   * @param {*} event
    enterKeyCode is the keyCode of enter key. List name will be added on pressing enter key. If name has all spaces then it will not be added into the list.
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
   * calls deleteSidebarList defined in api.js
   * @param {Number} listIndex   It is the index of list present in array of sidebar user generated list with which list is removed from main json data(main json has listName, tasks in that list(this includes details of a particular task) and sidebar.
   * 
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
        getTaskListAndMetadata(listUUID);
      }
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   * Every page has common Navbar, Sidebar and Header.
   * There is a route set for Recycle Bin separately. All other routes are dynamic which changes on the basis of list unique Id(which is the pathName). Each route has its own taskInputField and a container having list of tasks.
   * @return different components inside a router.
   */
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
