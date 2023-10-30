import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import pg from "pg";
import bodyParser from "body-parser";
import {
  getSidebarList,
  getTaskList,
  getListName,
  addSidebarList,
  deleteSidebarList,
  addTask,
  updateTask,
  reverseIsDone,
  addTaskToRecycleBin,
  deleteTask,
  moveTaskToRootList,
  MoveTaskFromRecycleBin,
  deleteTaskPermanently,
} from "./db.js";

const port = 4002;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectionString = "postgressql://postgres:password@localhost:5432/To Do";

export const client = new pg.Client({
  connectionString: connectionString,
});

client.connect();

/******** As for now user_id and recycle_bin_list_id is hard coded ******************/
//
export const user_id = "557e1292-e14f-43d4-a466-448923440365";
export const recycle_bin_list_id = "557e1292-e14f-43d4-a466-548923480335";
//
/****************************************************************************** */

// gets all user generated list and sends to frontend
app.get("/list", async (req, res) => {
  const sidebarUserGeneratedList = await getSidebarList();
  res.send({ sidebarUserGeneratedList });
});

// get the name and task list of a particular list based on its unique id and sends them to frontend. For getting name, getListName function(Defined in db.js) is called which gets name of list and for getting tasks, getTaskList(Defined in db.js) is called which gets list of tasks from database.
app.get("/list/:list_id", async (req, res) => {
  let { list_id } = req.params;
  let listName;
  let taskList;
  let recycleBinTaskList;
  if (list_id === recycle_bin_list_id) {
    recycleBinTaskList = await getTaskList(recycle_bin_list_id);
    listName = await getListName(recycle_bin_list_id);
  } else {
    taskList = await getTaskList(list_id);
    listName = await getListName(list_id);
  }
  res.send({ recycleBinTaskList, listName, taskList });
});

// calls addSidebarList defined in db.js which queries to post new list into database
app.post("/add_list", async (req, res) => {
  const { sidebarTaskListName } = req.body;
  const list_id = uuidv4();
  await addSidebarList(list_id, user_id, sidebarTaskListName);
  res.send();
});

// calls deleteSidebarList defined in db.js which queries to delete a list
app.delete("/delete_list", async (req, res) => {
  const { list_id } = req.query;
  await deleteSidebarList(list_id);
  res.send();
});

// calls addTask defined in db.js which queries to post a new task into database
app.post("/create_task", async (req, res) => {
  const { inputTask, currentListUUID } = req.body;
  const task_id = uuidv4();
  await addTask(currentListUUID, inputTask, task_id);
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
  const { task_id } = req.query;
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
  const { task_id, root_list_id } = req.body;
  await moveTaskToRootList(root_list_id);
  await MoveTaskFromRecycleBin(task_id);
  res.send();
});

//  calls deleteTaskPermanently defined in db.js which deleted task data from database
app.delete("/permanent_deletion", async (req, res) => {
  const { task_id } = req.query;
  await deleteTaskPermanently(task_id);
  res.send();
});

app.listen(port, console.log(`App is listening on port ${port}`));

process.on("exit", async () => {
  await client.end();
});
