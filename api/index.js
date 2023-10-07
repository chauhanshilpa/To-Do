import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import {
  TasksList,
  TasksListMetadata,
  Task,
  SidebarList,
  DeletedItemDetails,
} from "./ApiClassModels.js";

const port = 4002;
const app = express();
app.use(cors());

let sidebarUserGeneratedList = [];
let taskListsJSON = {
  my_day: new TasksList(new TasksListMetadata("My Day", "my_day", false)),
  recycle_bin: new TasksList(
    new TasksListMetadata("Recycle Bin", "recycle_bin", false)
  ),
};

app.get("/list", (req, res) => {
  res.send({ sidebarUserGeneratedList });
});

app.get("/list/:listUUID", (req, res) => {
  let listUUID = req.params["listUUID"];
  let metadata = taskListsJSON[listUUID]["metadata"];
  let taskList; 
  let recycleBinTaskList;
  if (listUUID === "recycle_bin") {
    recycleBinTaskList = taskListsJSON["recycle_bin"]["list"];
  } else {
    taskList = taskListsJSON[listUUID]["list"];
  }
  res.send({ recycleBinTaskList, metadata, taskList });
});

// APIs for adding list, deleting list and getting sidebar list uuid
app.get("/add_list", (req, res) => {
  const sidebarTaskListName = req.query.sidebarTaskListName;
  const listUuid = uuidv4();
  taskListsJSON[listUuid] = new TasksList(
    new TasksListMetadata(sidebarTaskListName, listUuid, true)
  );
  sidebarUserGeneratedList.push(new SidebarList(listUuid, sidebarTaskListName));
  res.send({
    sidebarUserGeneratedList,
  });
});

app.get("/delete_list", (req, res) => {
  const listIndex = JSON.parse(req.query.listIndex);
  sidebarUserGeneratedList.splice(listIndex, 1);
  res.send({
    sidebarUserGeneratedList,
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
  let deletedTask = taskListsJSON[currentListUUID]["list"].splice(taskIndex, 1);
  if (currentListTask.done === false) {
    let listUUID = taskListsJSON[currentListUUID]["metadata"]["pathName"];
    taskListsJSON["recycle_bin"]["list"].push(
      new DeletedItemDetails(listUUID, deletedTask[0])
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
  let listUUID = elementToRestore[0].pathName;
  let restoredTaskObject = elementToRestore[0].task;
  taskListsJSON[listUUID]["list"].push(restoredTaskObject);
  let recycleBinTaskList = taskListsJSON["recycle_bin"]["list"];
  res.send({ recycleBinTaskList });
});

app.listen(port, console.log(`App is listening on port ${port}`));
