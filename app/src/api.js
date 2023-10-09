import axios from "axios";
import { baseURL } from "./Constants";

export async function addSidebarList(sidebarTaskListName) {
  const response = await axios.get(`${baseURL}/add_list`, {
    params: {
      sidebarTaskListName,
    },
  });
  return response;
}

export async function deleteSidebarList(listIndex) {
  const response = await axios.get(`${baseURL}/delete_list`, {
    params: {
      listIndex: JSON.stringify(listIndex),
    },
  });
  return response;
}

export async function addTask(inputTask, currentListUUID) {
  const response = await axios.get(`${baseURL}/create_task`, {
    params: {
      currentListUUID: JSON.stringify(currentListUUID),
      inputTask,
    },
  });
  return response;
}

export async function getList() {
  const response = await axios(`${baseURL}/list`);
  return response;
}

export async function getListData(listUUID) {
  const response = await axios.get(`${baseURL}/list/${listUUID}`);
  return response;
}

export async function updateTask(taskIndex, currentListUUID, newInnerText){
  const response = await axios.get(`${baseURL}/update_task`, {
    params: {
      taskIndex: JSON.stringify(taskIndex),
      currentListUUID: JSON.stringify(currentListUUID),
      newInnerText,
    },
  });
  return response;
}

export async function deleteTask(taskIndex, currentListUUID, taskInfo){
  const response = await axios.get(`${baseURL}/delete_task`, {
    params: {
      taskIndex: JSON.stringify(taskIndex),
      currentListUUID: JSON.stringify(currentListUUID),
      taskInfo: JSON.stringify(taskInfo),
    },
  });
  return response;
}

export async function restoreTaskFromRecycleBin(objectIndex){
  const response = await axios(`${baseURL}/restore_task`, {
    params: {
      objectIndex: JSON.stringify(objectIndex),
    },
  });
  return response;
}

export async function deleteTaskFromRecycleBin(objectIndex){
  const response = await axios.get(`${baseURL}/permanent_deletion`, {
    params: {
      objectIndex: JSON.stringify(objectIndex),
    },
  });
  return response;
}

export async function setTaskDone(taskIndex, taskInfo, currentListUUID){
  const response = await axios.get(`${baseURL}/task_done`, {
    params: {
      taskIndex: JSON.stringify(taskIndex),
      taskInfo: JSON.stringify(taskInfo),
      currentListUUID: JSON.stringify(currentListUUID),
    },
  });
  return response;
}

