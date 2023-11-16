import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import pg from "pg";
import bodyParser from "body-parser";
import { connectionString } from "./dbConnectionString.js";

import {
  checkUserExistence,
  addUser,
  addPredefinedList,
  getUserId,
  getSidebarLists,
  getListName,
  getTaskList,
  addSidebarList,
  deleteSidebarList,
  addTask,
  updateTask,
  reverseIsDone,
  addTaskToRecycleBin,
  deleteTask,
  moveTaskToRootList,
  removeTaskFromRecycleBin,
  deleteTaskPermanently,
} from "./db.js";

const port = 4002;
const app = express();
app.use(cors());
app.use(bodyParser.json());

export const client = new pg.Client({
  connectionString: connectionString,
});

client.connect();

//will check if container container is health or not (for docker)
app.get("/health", async (req, res) => {
  const health = "Service is healthy";
  res.send({ health });
});

// calls checkUserExistence defined in db.js which queries for userId get boolean value whether a user is registered or not
app.get("/user_registered", async (req, res) => {
  const { email } = req.query;
  const response = await checkUserExistence(email);
  let registered;
  if (response.length === 0) {
    registered = false;
  } else {
    registered = true;
  }
  res.send({ registered });
});

// calls addUser defined in db.js which queries to add a new user and some other details, then calls addPredefinedList defined in db.js which queries to add predefined list into user's account
app.post("/sign_up", async (req, res) => {
  const { email, username, password } = req.body;
  const newUserId = uuidv4();
  await addUser(newUserId, email, username, password);
  const predefinedLists = ["My Day", "Recycle Bin"];
  await Promise.all(
    predefinedLists.map((listName) => addPredefinedList(newUserId, listName))
  );
  res.send();
});

// calls getUserId defined in db.js defined in db.js which queries to get if a user with these credentials exists or not. if user exists it has some value in response so if its length is not equal to zero isValid is true else false.
app.get("/valid_user", async (req, res) => {
  const { email, username, password } = req.query;
  const response = await getUserId(email, username, password);
  let isValid;
  if (response.length !== 0) {
    isValid = true;
  } else {
    isValid = false;
  }
  res.send({ isValid });
});

// calls getUserId defined in db.js which queries to get id of user with which credentials belongs to
app.get("/user_id", async (req, res) => {
  const { email, username, password } = req.query;
  const response = await getUserId(email, username, password);
  const userId = response[0].user_id;
  res.send({ userId });
});

// calls getSidebarLists defined in db.js which queries to get all list of sidebar(including predefined lists and user generated lists)
app.get("/list", async (req, res) => {
  const { userId } = req.query;
  const lists = await getSidebarLists(userId);
  res.send({ lists });
});

// get the name and task list of a particular list. For getting name, getListName function(Defined in db.js) is called which gets name of list and for getting tasks, getTaskList(Defined in db.js) is called which gets list of tasks from database.
app.get("/list/:listId", async (req, res) => {
  const { listId } = req.params;
  let listName;
  let taskList;
  taskList = await getTaskList(listId);
  listName = await getListName(listId);
  res.send({ listName, taskList });
});

// calls addSidebarList defined in db.js which queries to post new list into database
app.post("/add_list", async (req, res) => {
  const { userId, sidebarTaskListName } = req.body;
  const listId = uuidv4();
  await addSidebarList(listId, userId, sidebarTaskListName);
  res.send();
});

// calls deleteSidebarList defined in db.js which queries to delete a list
app.delete("/delete_list", async (req, res) => {
  const { listId, userId } = req.query;
  await deleteSidebarList(listId, userId);
  res.send();
});

// calls addTask defined in db.js which queries to post a new task into database
app.post("/create_task", async (req, res) => {
  const { inputTask, currentListUUID } = req.body;
  const taskId = uuidv4();
  await addTask(currentListUUID, inputTask, taskId);
  res.send();
});

// calls updateTask defined in db.js which queries to update the text of task
app.patch("/update_task", async (req, res) => {
  const { task_id, newInnerText } = req.body;
  await updateTask(task_id, newInnerText);
  res.send();
});

// calls addTaskToRecycleBin defined in db.js to add a task to recycle bin then calls deleteTask defined in db.js to delete the task from that list
app.delete("/delete_task", async (req, res) => {
  const { task_id, recycle_bin_list_id } = req.query;
  await addTaskToRecycleBin(task_id, recycle_bin_list_id);
  await deleteTask(task_id);
  res.send();
});

// calls reverseIsDone defined in db.js to reverse is_done property of task
app.patch("/task_done", async (req, res) => {
  const { task_id, currentIsDone } = req.body;
  await reverseIsDone(task_id, currentIsDone);
  res.send();
});

// calls moveTaskToRootList defined in db.js to move a task to its originated list then calls restoreTask defined in db.js which remove task from recycle bin
app.post("/restore_task", async (req, res) => {
  const { task_id, root_list_task_id } = req.body;
  await moveTaskToRootList(root_list_task_id);
  await removeTaskFromRecycleBin(task_id);
  res.send();
});

// calls deleteTaskPermanently defined in db.js which delete task data from database
app.delete("/permanent_deletion", async (req, res) => {
  const { task_id } = req.query;
  await deleteTaskPermanently(task_id);
  res.send();
});

app.listen(port, console.log(`App is listening on port ${port}`));

process.on("exit", async () => {
  await client.end();
});
