import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TasksInputField from "./components/TasksInputField";
import TasksContainer from "./components/TasksContainer";
import RecycleBinTasksContainer from "./components/RecycleBinTasksContainer";
import Modal from "./components/Modal";
import {
  THEME,
  ENTER_KEY_CODE,
  DEFAULT_LIST,
  RECYCLE_BIN_LIST,
} from "./Constants";
import {
  addSidebarList,
  deleteSidebarList,
  addTask,
  getList,
  getListData,
} from "./api";

/**
 *
 * It is the entry point of To Do application
 */
function App() {
  const [appBodyTheme, setAppBodyTheme] = useState(THEME.LIGHT.name);
  const [inputTask, setInputTask] = useState("");
  const [sidebarOpenState, setSidebarOpenState] = useState(false);
  const [sidebarTaskListName, setSidebarTaskListName] = useState("");
  const [currentListUUID, setCurrentListUUID] = useState(DEFAULT_LIST.id);
  const [sidebarUserGeneratedList, setSidebarUserGeneratedList] = useState([]);
  const [currentListName, setCurrentListName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [recycleBinTaskList, setRecycleBinTaskList] = useState([]);

  let modalButtonRef = useRef();

  useEffect(() => {
    getSidebarList();
    getTaskListAndListName(DEFAULT_LIST.id);
    // eslint-disable-next-line
  }, []);

  /**
   * calls getList function defined in api.js which fetches all lists of sidebar from backend and shows on UI.
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
   * calls getListData function defined in api.js and passes list_id which fetches listName and all tasks of this list from backend.
   * @param {String} list_id   It is unique id of list
   */
  async function getTaskListAndListName(list_id) {
    try {
      const response = await getListData(list_id);
      setCurrentListName(response.data.listName);
      if (list_id === RECYCLE_BIN_LIST.id) {
        setRecycleBinTaskList(response.data.recycleBinTaskList);
      } else {
        setTaskList(response.data.taskList);
      }
      setCurrentListUUID(list_id);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   * This function runs while a sidebar list is clicked, sets it as current list and shows all the data of that list only(its task list and name of list).
   * @param {String} list_id   It is unique id of list
   */
  function onListClick(list_id) {
    setCurrentListUUID(list_id);
    getTaskListAndListName(list_id);
  }

  function handleLightAndDarkMode() {
    if (appBodyTheme === THEME.LIGHT.name) {
      setAppBodyTheme(THEME.DARK.name);
      document.body.style.backgroundColor = THEME.DARK.backgroundColor;
    } else {
      setAppBodyTheme(THEME.DARK.name);
      document.body.style.backgroundColor = THEME.LIGHT.backgroundColor;
    }
  }

  function toggleSidebarOpenState() {
    setSidebarOpenState(!sidebarOpenState);
  }

  function handleInputTaskChange(event) {
    setInputTask(event.target.value);
  }

  /**
   * calls a function addTask defined in api.js which sends a post request to add a task and then calls getTaskListAndListName to get the name and task list of that particular list.
   * If there is a failure in api call, it catches the error and shows a pop up.
   * @param {*} event
   * ENTER_KEY_CODE is the keyCode of enter key defined in Constants.js. Task will be added on pressing enter key. If task has all spaces then it will not be added into the list.
   */
  async function handleNewTask(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      if (inputTask.trim().length !== 0) {
        try {
          await addTask(inputTask, currentListUUID);
          await getTaskListAndListName(currentListUUID);
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
   * calls a function addSidebarList defined in api.js which sends a post request to add new list data and then calls getSidebarList to get all sidebar list including the new one. It catches the error and shows a pop up if there is a failure in api call.
   * @param {*} event
    ENTER_KEY_CODE is the keyCode of enter key. List name will be added on pressing enter key with no trailing and leading spaces. If name has all spaces then it will not be added into the list.
   */
  async function handleNewSidebarList(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      if (sidebarTaskListName.trim().length !== 0) {
        try {
          await addSidebarList(sidebarTaskListName);
          await getSidebarList();
        } catch (error) {
          modalButtonRef.current.click();
        }
        setSidebarTaskListName("");
      }
    }
  }

  /**
   *
   * calls deleteSidebarList defined in api.js, post the request to delete list from database and then calls getSidebarList to get updated list. It catches the error and shows a pop up if there is a failure in api call.
   * @param {String} list_id   It is unique id of list
   * if a current list is deleted, we will move to previous list as current list if current list is the first list, we will move to default list path.
   */
  async function handleSidebarListDeletion(event, list_id, list_index) {
    event.stopPropagation();
    try {
      let new_list_id;
      if (currentListUUID === sidebarUserGeneratedList[list_index].list_id) {
        if (list_index === 0) {
          new_list_id = DEFAULT_LIST.id;
        } else {
          new_list_id = sidebarUserGeneratedList[list_index - 1].list_id;
        }
        setCurrentListUUID(new_list_id);
        await getTaskListAndListName(new_list_id);
      }
      await deleteSidebarList(list_id);
      await getSidebarList();
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   * Every page has common Navbar, Sidebar and Header.
   * There is a route set for Recycle Bin separately as its user interface and passed parameters were different from other lists. All other routes are dynamic which changes on the basis of list unique id(which is the pathName). Each route has its own taskInputField and a container having list of tasks.
   * @return navbar, sidebar, header, recycle bin container and other list containers based on path inside a router.
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
          listName={currentListName}
        />
        <Modal
          modalButtonRef={modalButtonRef}
          modalTitle="Error"
          modalBody="Oops, something went wrong. Please try again later."
        />
        <Routes>
          <Route
            exact
            path="/:currentListUUID"
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
                  modalButtonRef={modalButtonRef}
                  getTaskListAndListName={getTaskListAndListName}
                />
              </>
            }
          />
          <Route
            exact
            path={RECYCLE_BIN_LIST.id}
            element={
              <>
                <RecycleBinTasksContainer
                  appBodyTheme={appBodyTheme}
                  sidebarOpenState={sidebarOpenState}
                  modalButtonRef={modalButtonRef}
                  recycleBinTaskList={recycleBinTaskList}
                  getTaskListAndListName={getTaskListAndListName}
                />
              </>
            }
          />
          <Route path="/" element={<Navigate to={DEFAULT_LIST.id} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
