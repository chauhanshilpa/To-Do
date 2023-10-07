import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import {
  TasksList,
  TasksListMetadata,
  Task,
  SidebarDynamicList,
  DeletedItemDetails,
} from "./ApiClassModels.js";

const port = 4002;
const app = express();
app.use(cors());

let sidebarDynamicList = [];
let taskListsJSON = {
  my_day: new TasksList(new TasksListMetadata("My Day", "my_day", false)),
  recycle_bin: new TasksList(
    new TasksListMetadata("Recycle Bin", "recycle_bin", false)
  ),
};

app.get("/list", (req, res) => {
  res.send({ sidebarDynamicList });
});

app.get("/list/:path", (req, res) => {
  let uuid = req.params["path"];
  let taskList = taskListsJSON[uuid]["list"];
  let metadata = taskListsJSON[uuid]["metadata"];
  let recycleBinTaskList = taskListsJSON["recycle_bin"]["list"];
  res.send({ recycleBinTaskList, metadata, taskList });
});

// APIs for adding list, deleting list and getting sidebar list uuid
app.get("/add_list", (req, res) => {
  const sidebarTaskListName = req.query.sidebarTaskListName;
  const listUuid = uuidv4();
  taskListsJSON[listUuid] = new TasksList(
    new TasksListMetadata(sidebarTaskListName, listUuid, true)
  );
  sidebarDynamicList.push(
    new SidebarDynamicList(listUuid, sidebarTaskListName)
  );
  res.send({
    sidebarDynamicList,
  });
});

app.get("/delete_list", (req, res) => {
  const listIndex = JSON.parse(req.query.listIndex);
  sidebarDynamicList.splice(listIndex, 1);
  res.send({
    sidebarDynamicList,
  });
});

// APIs for creating, updating and deleting task and getting if task is done or not
app.get("/create_task", (req, res) => {
  const currentListUUID = JSON.parse(req.query.currentListUUID);
  const inputTask = req.query.inputTask;
  const taskUuid = uuidv4();
  taskListsJSON[currentListUUID]["list"].push(
    new Task(taskUuid, inputTask, false)
  );
  let taskList = taskListsJSON[currentListUUID]["list"];
  res.send({ taskList });
});

app.get("/update_task", (req, res) => {
  const taskIndex = JSON.parse(req.query.taskIndex);
  const currentListUUID = JSON.parse(req.query.currentListUUID);
  const newInnerText = req.query.newInnerText;
  taskListsJSON[currentListUUID]["list"][taskIndex]["text"] = newInnerText; // Updated text
  let taskList = taskListsJSON[currentListUUID]["list"];
  res.send({ taskList });
});

app.get("/delete_task", (req, res) => {
  const taskIndex = JSON.parse(req.query.taskIndex);
  const currentListUUID = JSON.parse(req.query.currentListUUID);
  const currentListTask = JSON.parse(req.query.currentListTask);
  // deletedTask contains an object which has a text key, a uuid key ( unique for every single task), a done key and a date key.
  let deletedTask = taskListsJSON[currentListUUID]["list"].splice(
    taskIndex,
    1
  );
  if (currentListTask.done === false) {
    let pathNameOfList =
      taskListsJSON[currentListUUID]["metadata"]["pathName"];
    taskListsJSON["recycle_bin"]["list"].push(
      new DeletedItemDetails(pathNameOfList, deletedTask[0])
    );
  }
  let taskList = taskListsJSON[currentListUUID]["list"];
  res.send({ taskList });
});

app.get("/task_done", (req, res) => {
  const taskIndex = JSON.parse(req.query.taskIndex);
  const currentListTask = JSON.parse(req.query.currentListTask);
  const currentListUUID = JSON.parse(req.query.currentListUUID);
  let taskList = taskListsJSON[currentListUUID]["list"];
  taskList[taskIndex]["done"] = currentListTask.done;
  let completedTask = taskList.splice(taskIndex, 1);
  if (currentListTask.done === true) {
    taskList.unshift(completedTask[0]);
  } else {
    taskList.push(completedTask[0]);
    currentListTask.done = false;
  }
  res.send({ taskList });
});

// APIs for permanent deletion and restoration of task from Recycle Bin
app.get("/permanent_deletion", (req, res) => {
  const objectIndex = JSON.parse(req.query.objectIndex);
  taskListsJSON["recycle_bin"]["list"].splice(objectIndex, 1);
  let recycleBinTaskList = taskListsJSON["recycle_bin"]["list"];
  res.send({ recycleBinTaskList });
});

app.get("/restore_task", (req, res) => {
  const objectIndex = JSON.parse(req.query.objectIndex);
  let elementToRestore = taskListsJSON["recycle_bin"]["list"].splice(
    objectIndex,
    1
  );
  let pathNameOfList = elementToRestore[0].pathName;
  let restoredTaskObject = elementToRestore[0].task;
  taskListsJSON[pathNameOfList]["list"].push(restoredTaskObject);
  let recycleBinTaskList = taskListsJSON["recycle_bin"]["list"];
  res.send({ recycleBinTaskList });
});

app.listen(port, console.log(`App is listening on port ${port}`));
