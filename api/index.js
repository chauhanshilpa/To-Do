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
  const currentList_uuid = JSON.parse(req.query.currentList_uuid);
  const inputTask = req.query.inputTask;
  const taskUuid = uuidv4();
  taskListsJSON[currentList_uuid]["list"].push(
    new Task(taskUuid, inputTask, false)
  );
  let taskList = taskListsJSON[currentList_uuid]["list"];
  res.send({ taskList });
});

app.get("/update_task", (req, res) => {
  const taskIndex = JSON.parse(req.query.taskIndex);
  const currentList_uuid = JSON.parse(req.query.currentList_uuid);
  const newInnerText = req.query.newInnerText;
  taskListsJSON[currentList_uuid]["list"][taskIndex]["text"] = newInnerText; // Updated text
  let taskList = taskListsJSON[currentList_uuid]["list"];
  res.send({ taskList });
});

app.get("/delete_task", (req, res) => {
  const taskIndex = JSON.parse(req.query.taskIndex);
  const currentList_uuid = JSON.parse(req.query.currentList_uuid);
  const currentListTask = JSON.parse(req.query.currentListTask);
  // deletedTask contains an object which has a text key, a uuid key ( unique for every single task), a done key and a date key.
  let deletedTask = taskListsJSON[currentList_uuid]["list"].splice(
    taskIndex,
    1
  );
  if (currentListTask.done === false) {
    let pathNameOfList =
      taskListsJSON[currentList_uuid]["metadata"]["pathName"];
    taskListsJSON["recycle_bin"]["list"].push(
      new DeletedItemDetails(pathNameOfList, deletedTask[0])
    );
  }
  let taskList = taskListsJSON[currentList_uuid]["list"];
  res.send({ taskList });
});

app.get("/task_done", (req, res) => {
  const taskIndex = JSON.parse(req.query.taskIndex);
  const currentListTask = JSON.parse(req.query.currentListTask);
  const currentList_uuid = JSON.parse(req.query.currentList_uuid);
  let taskList = taskListsJSON[currentList_uuid]["list"];
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
