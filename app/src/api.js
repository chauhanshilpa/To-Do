import axios from "axios";
import { BASE_URL } from "./Constants";
// This file contains all api calls from frontend to backend


export async function userRegistered(email){
  const response = await axios.get(`${BASE_URL}/user_registered`, {
    params: {
    email
    }
  })
  return response;
}

export async function addNewUser(email, username, password) {
  await axios.post(`${BASE_URL}/sign_up`, {
    email,
    username,
    password,
  });
  return;
}

export async function getUserId(email, username, password) {
  const response = await axios.get(`${BASE_URL}/user_id`, {
    params: {
      email,
      username,
      password,
    },
  });
  return response;
}

export async function checkUserValidity(email, username, password) {
  const response = await axios.get(`${BASE_URL}/valid_user`, {
    params: {
      email,
      username,
      password,
    },
  });
  return response;
}





/**
 *
 * sends a get request to backend to get all list of sidebar
 * @returns lists of sidebar
 */
export async function getList(userId) {
  const response = await axios.get(`${BASE_URL}/list`, {
    params: {
      userId,
    },
  });
  return response;
}
















/**
 *
 * sends a get request to backend to get list data
 * @param {String} list_id   It is unique id of list
 * @returns task list and list name based of list unique id
 */
export async function getListData(listId) {
  const response = await axios.get(`${BASE_URL}/list/${listId}`);
  return response;
}

/**
 *
 * sends a post request to backend to add a list
 * @param {String} sidebarTaskListName  it is the name of sidebar list to add
 */
export async function addSidebarList(userId, sidebarTaskListName) {
  await axios.post(`${BASE_URL}/add_list`, {
    userId,
    sidebarTaskListName,
  });
  return;
}

/**
 *
 * sends a delete request to backend to delete a particular list based of list unique id
 * @param {String} list_id   It is unique id of list
 */
export async function deleteSidebarList(listId, userId) {
  await axios.delete(`${BASE_URL}/delete_list`, {
    params: {
      listId,
      userId,
    },
  });
  return;
}

/**
 *
 * sends a post request to backend to add task in a list
 * @param {String} inputTask  text of task to add(which is typed before pressing enter in input field)
 * @param {String} currentListUUID  unique id of current open list in which tasks are being added
 */
export async function addTask(inputTask, currentListUUID) {
  await axios.post(`${BASE_URL}/create_task`, {
    currentListUUID,
    inputTask,
  });
  return;
}

/**
 *
 * sends a patch request to backend to update text of a particular task based on task_id
 * @param {String} task_id  unique id of task
 * @param {String} newInnerText  new text of task
 */
export async function updateTask(task_id, newInnerText) {
  await axios.patch(`${BASE_URL}/update_task`, {
    task_id,
    newInnerText,
  });
  return;
}

/**
 *
 * sends a delete request to backend to delete a task based on task_id
 * @param {String} task_id  unique id of a task
 */
export async function deleteTask(task_id, recycle_bin_list_id) {
  await axios.delete(`${BASE_URL}/delete_task`, {
    params: {
      task_id,
      recycle_bin_list_id
    },
  });
  return;
}

/**
 *
 * sends a patch request to backend to reverse is_done property of task
 * @param {String} task_id  unique id of a task
 * @param {String} currentIsDone  boolean value which tells is_done property value
 */
export async function reverseTaskDone(task_id, currentIsDone) {
  await axios.patch(`${BASE_URL}/task_done`, {
    task_id,
    currentIsDone,
  });
}

/**
 *
 * sends a post request to restore a task to its original list before deletion
 * @param {String} task_id  unique id of a task
 * @param {String} root_list_id  unique id of list, the task belongs to
 */
export async function restoreTaskFromRecycleBin(task_id, root_list_task_id) {
  await axios.post(`${BASE_URL}/restore_task`, {
    task_id,
    root_list_task_id,
  });
  return;
}

/**
 *
 * sends a post request to backend to delete a task from recycle_bin based on task's unique id
 * @param {String} task_id  unique id of task
 */
export async function deleteTaskFromRecycleBin(task_id) {
  await axios.delete(`${BASE_URL}/permanent_deletion`, {
    params: {
      task_id,
    },
  });
  return;
}
