import React, { useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TasksInputField from "./components/TasksInputField";
import TasksContainer from "./components/TasksContainer";
import RecycleBinTasksContainer from "./components/RecycleBinTasksContainer";
import Modal from "./components/Modal";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { THEME, ENTER_KEY_CODE } from "./Constants";
import {
  userRegistered,
  addNewUser,
  getUserId,
  checkUserValidity,
  getList,
  addSidebarList,
  deleteSidebarList,
  addTask,
  getListData,
} from "./api";

/**
 *
 * It is the entry point of To Do application
 */
function App() {
  const [appBodyTheme, setAppBodyTheme] = useState(THEME.LIGHT.name);
  const [inputTask, setInputTask] = useState("");

  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [userId, setUserId] = useState("");
  const [isUserValid, setIsUserValid] = useState(false);
  const [predefinedList, setPredefinedList] = useState({
    DEFAULT_LIST: { id: "", name: "" },
    RECYCLE_BIN_LIST: { id: "", name: "" },
  });

  const [sidebarOpenState, setSidebarOpenState] = useState(false);
  const [sidebarTaskListName, setSidebarTaskListName] = useState("");
  const [currentListUUID, setCurrentListUUID] = useState();
  const [sidebarUserGeneratedList, setSidebarUserGeneratedList] = useState([]);
  const [currentListName, setCurrentListName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [recycleBinTaskList, setRecycleBinTaskList] = useState([]);

  let modalButtonRef = useRef();

  const { DEFAULT_LIST, RECYCLE_BIN_LIST } = predefinedList;

  function handleUsernameChange(event) {
    setCredentials({ ...credentials, username: event.target.value });
  }

  function handleMailChange(event) {
    setCredentials({ ...credentials, email: event.target.value });
  }

  function handlePasswordChange(event) {
    setCredentials({ ...credentials, password: event.target.value });
  }

  function handleConfirmPasswordChange(event) {
    setCredentials({ ...credentials, confirmPassword: event.target.value });
  }

  /**
   * 
   * This function runs first time when a user registers. 
   * This function first checks whether password and confirm password are same, if not it shows an alert. If both are same then it checks whether a user is already registered or not. If user is not registered, addNewUser function defined in api.js is called which adds a new user details and make two default lists. 
   Then it calls getUserId function defined in api.js which gets user id, then set it in a variable.
   Further sidebarAllLists function is called defined in app.js which will set values of predefined lists so that a user can see it in UI. AT the end, isUserValid variable is set to to true so that user can use the application for maintaining its to dos.
   * @param {*} event 
   */
  async function handleUserSignUp(event) {
    event.preventDefault();
    const { email, username, password, confirmPassword } = credentials;
    const response = await userRegistered(email);
    const isUserRegistered = response.data.registered;
    if (password === confirmPassword) {
      if (isUserRegistered === false) {
        await addNewUser(email, username, password);
        const response = await getUserId(email, username, password);
        setUserId(response.data.userId);
        await sidebarAllLists(response.data.userId);
        setIsUserValid(true);
        // setCurrentListUUID(DEFAULT_LIST.id)
        // getTaskListAndListName(DEFAULT_LIST.id);
      } else {
        alert("User with this email already exists.");
      }
      setCredentials({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
    } else {
      alert("Confirm password is different from password. Please check it again.");
    }
  }

  /**
   * 
   * this function runs for already existing users with correct credentials.
   * first of all this function check user validity and if a user is valid(having correct credentials), it calls getUserId defined in api.js to get user id and calls sidebarAllLists defined in App.js to get all list present in user's account.
   * @param {*} event 
   */
  async function handleUserLogin(event) {
    event.preventDefault();
    const { email, username, password } = credentials;
    const response = await checkUserValidity(email, username, password);
    setIsUserValid(response.data.isValid);
    if (response.data.isValid) {
      const response = await getUserId(email, username, password);
      setUserId(response.data.userId);
      await sidebarAllLists(response.data.userId);
      // setCurrentListUUID(DEFAULT_LIST.id)
      // getTaskListAndListName(DEFAULT_LIST.id);
    } else {
      alert("Wrong user details.");
    }
    setCredentials({ email: "", username: "", password: "" });
  }

  /**
   * 
   * calls getList function defined in api.js which fetches all lists of sidebar including predefined lists and user generated list.Then set the variable accordingly.
   * If there is failure in API call, a pop up will be shown.
   */
  async function sidebarAllLists(userId) {
    try {
      const response = await getList(userId);
      const lists = response.data.lists;
      const predefinedLists = lists.slice(0, 2);
      setPredefinedList({
        DEFAULT_LIST: {
          id: predefinedLists[0].list_id,
          name: predefinedLists[0].list_name,
        },
        RECYCLE_BIN_LIST: {
          id: predefinedLists[1].list_id,
          name: predefinedLists[1].list_name,
        },
      });
      const userGeneratedLists = lists.slice(2);
      setSidebarUserGeneratedList(userGeneratedLists);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   *
   * calls getListData function defined in api.js and passes listId which gets name of list and all tasks of this list.
   * @param {String} listId   It is unique id of list
   */
  async function getTaskListAndListName(listId) {
    try {
      const response = await getListData(listId);
      setCurrentListName(response.data.listName);
      if (listId === RECYCLE_BIN_LIST.id) {
        setRecycleBinTaskList(response.data.taskList);
      } else {
        setTaskList(response.data.taskList);
      }
      setCurrentListUUID(listId);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   * 
   * This function runs while a sidebar list is clicked, sets it as current list and shows all the data of that list only(its task list and name of list).
   * @param {String} listId    It is unique id of list
   */
  function onListClick(listId) {
    setCurrentListUUID(listId);
    getTaskListAndListName(listId);
  }

  function handleLightAndDarkMode() {
    if (appBodyTheme === THEME.LIGHT.name) {
      setAppBodyTheme(THEME.DARK.name);
      document.body.style.backgroundColor = THEME.DARK.backgroundColor;
    } else {
      setAppBodyTheme(THEME.LIGHT.name);
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
   * 
   * calls a function addTask defined in api.js which sends a post request to add a task and then calls getTaskListAndListName defined in app.js to get the name and task list of that particular list.
   * If there is a failure in api call, it catches the error and shows a pop up.
   * @param {*} event
   * ENTER_KEY_CODE is the keyCode of enter key defined in Constants.js. 
   * Task will be added on pressing enter key. It also removes all trailing and leading space.If task has all spaces then it will not be added into the list.
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
   * 
   * calls a function addSidebarList defined in api.js and then calls getSidebarList to get all sidebar list including the new one. It catches the error and shows a pop up if there is a failure in api call.
   * @param {*} event
    ENTER_KEY_CODE is the keyCode of enter key. List name will be added on pressing enter key with no trailing and leading spaces. If name has all spaces then it will not be added into the list.
   */
  async function handleNewSidebarList(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      if (sidebarTaskListName.trim().length !== 0) {
        try {
          await addSidebarList(userId, sidebarTaskListName);
          await sidebarAllLists(userId);
        } catch (error) {
          modalButtonRef.current.click();
        }
        setSidebarTaskListName("");
      }
    }
  }

  /**
   *
   * calls deleteSidebarList function defined in api.js for deletion a list and then calls getSidebarList to get updated list. It catches the error and shows a pop up if there is a failure in api call.
   * @param {String} list_id   It is unique id of list
   */
  async function handleSidebarListDeletion(event, listId, listIndex) {
    event.stopPropagation();
    try {
      await deleteSidebarList(listId, userId);
      await sidebarAllLists(userId);
    } catch (error) {
      modalButtonRef.current.click();
    }
  }

  /**
   * 
   * When application loads, first a signup form will be open by default or one can go to login form also, can login if user is valid. Once a user form is submitted with valid credentials, task managing application can be seen.
   * If user is valid, there is a route set for Recycle Bin separately as its user interface(no header and different svg logo) is different from other lists. All other routes are dynamic which changes on the basis of list unique id(which is the pathName). Each route has its own taskInputField and a container having list of tasks.
   * @return navbar, sidebar, header, recycle bin container and other list containers based on path inside a router, a login and signup form.
   */
  return (
    <>
      <BrowserRouter>
        <Navbar
          handleLightAndDarkMode={handleLightAndDarkMode}
          appBodyTheme={appBodyTheme}
        />
        <Modal
          modalButtonRef={modalButtonRef}
          modalTitle="Error"
          modalBody="Oops, something went wrong. Please try again later."
        />
        {isUserValid === false ? (
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route
              exact
              path="/login"
              element={
                <Login
                  appBodyTheme={appBodyTheme}
                  handleUserLogin={handleUserLogin}
                  credentials={credentials}
                  handleUsernameChange={handleUsernameChange}
                  handleMailChange={handleMailChange}
                  handlePasswordChange={handlePasswordChange}
                />
              }
            />
            <Route
              exact
              path="/signup"
              element={
                <Signup
                  appBodyTheme={appBodyTheme}
                  handleUserSignUp={handleUserSignUp}
                  credentials={credentials}
                  handleUsernameChange={handleUsernameChange}
                  handleMailChange={handleMailChange}
                  handlePasswordChange={handlePasswordChange}
                  handleConfirmPasswordChange={handleConfirmPasswordChange}
                />
              }
            />
          </Routes>
        ) : (
          <>
            <Header
              appBodyTheme={appBodyTheme}
              toggleSidebarOpenState={toggleSidebarOpenState}
              sidebarOpenState={sidebarOpenState}
              listName={currentListName}
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
                      predefinedList={predefinedList}
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
                      predefinedList={predefinedList}
                      modalButtonRef={modalButtonRef}
                      recycleBinTaskList={recycleBinTaskList}
                      getTaskListAndListName={getTaskListAndListName}
                    />
                  </>
                }
              />
            </Routes>
          </>
        )}
        {sidebarOpenState && (
          <Sidebar
            appBodyTheme={appBodyTheme}
            sidebarOpenState={sidebarOpenState}
            onListClick={onListClick}
            predefinedList={predefinedList}
            sidebarTaskListName={sidebarTaskListName}
            handleSidebarListChange={handleSidebarListChange}
            handleNewSidebarList={handleNewSidebarList}
            sidebarUserGeneratedList={sidebarUserGeneratedList}
            handleSidebarListDeletion={handleSidebarListDeletion}
          />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
