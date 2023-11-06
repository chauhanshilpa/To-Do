import { client } from "./index.js";
import { v4 as uuidv4 } from "uuid";
import { TaskMetadata } from "./dbClassModel.js";

// db.js contains functions which send queries to database

/**
 * @param {String} email   email of a user
 * @returns email of user (it may have or may have not)
 */
export async function checkUserExistence(email) {
  const query = {
    text: "SELECT email from users where email = $1",
    values: [email],
  };
  const response = await client.query(query);
  return response.rows;
}

/**
 * queries to add a new user data
 * @param {String} newUserId    unique id of a new user
 * @param {String} email        email id of a user
 * @param {String} username     name of a user
 * @param {String} password     password of a user
 */
export async function addUser(newUserId, email, username, password) {
  const query = {
    text: "INSERT INTO users (user_id, email, username, password, created) VALUES ($1, $2, $3, $4, $5)",
    values: [newUserId, email, username, password, new Date().toUTCString()],
  };
  await client.query(query);
  return;
}

/**
 * queries to add predefined list of a new user
 * @param {String} newUserId    user id of a newly added user
 * @param {String} listName     name of predefined list
 */
export async function addPredefinedList(newUserId, listName) {
  let predefined_list_id = uuidv4();
  const query = {
    text: "INSERT INTO list (list_id, user_id, list_name, deletable, created, deleted) VALUES ($1, $2, $3, $4, $5, $6)",
    values: [
      predefined_list_id,
      newUserId,
      listName,
      false,
      new Date().toUTCString(),
      false,
    ],
  };
  await client.query(query);
  return;
}

/**
 * @param {String} email      email id of a user
 * @param {String} username   name of a user
 * @param {String} password   password of a user
 * @returns user's unique id
 */
export async function getUserId(email, username, password) {
  const query = {
    text: "SELECT user_id FROM users WHERE email= $1 AND username= $2 AND password= $3",
    values: [email, username, password],
  };
  const response = await client.query(query);
  return response.rows;
}

/**
 * @param {String} user_id     user id of a newly added user
 * @returns all sidebar lists including predefined lists and user generated lists
 */
export async function getSidebarLists(user_id) {
  const query = {
    text: "SELECT * FROM list WHERE deleted = $1 AND user_id = $2",
    values: [false, user_id],
  };
  const response = await client.query(query); 
  return response.rows; 
}

/**
 * @param {String} list_id    unique id of a list
 * @returns name of list
 */
export async function getListName(list_id) {
  const query = {
    text: "SELECT list_name FROM list WHERE list_id = $1",
    values: [list_id],
  };
  let response = await client.query(query);
  return response.rows[0].list_name;
}

/**
 * @param {String} list_id    unique id of list
 * @returns list of tasks
 */
export async function getTaskList(list_id) {
  const query = {
    text: "SELECT * FROM tasks WHERE list_id = $1 AND deleted = $2 ORDER BY created DESC",
    values: [list_id, false],
  };
  let response = await client.query(query);
  return response.rows;
}

/**
 * queries to add new list into the database having columns list_id, user_id, list_name, deletable(can be deleted or not), created(date of creation of list), deleted(deleted or exists)
 * @param {String} list_id      unique id of list
 * @param {String} user_id      unique id of a user
 * @param {String} list_name    name of list
 */
export async function addSidebarList(list_id, user_id, list_name) {
  const query = {
    text: "INSERT INTO list (list_id, user_id, list_name, deletable, created, deleted) VALUES ($1, $2, $3, $4, $5, $6)",
    values: [
      list_id,
      user_id,
      list_name,
      true,
      new Date().toUTCString(),
      false,
    ],
  };
  await client.query(query);
  return;
}

/**
 * queries to change list deleted value to true so that it is not shown in sidebar anymore
 * @param {String} list_id   unique id of list
 * @param {String} user_id   unique id of user
 */
export async function deleteSidebarList(list_id, user_id) {
  const query = {
    text: "UPDATE list SET deleted = $1 WHERE list_id = $2 AND user_id = $3",
    values: [true, list_id, user_id],
  };
  await client.query(query);
  return;
}

/**
 * queries to add new task in tasks table of database having columns task_id, list_id, is_done(true or false), metadata(have its text and task_id), created(date of creation of task) and deleted(deleted or exists)
 * @param {String} list_id   unique id of list
 * @param {String} text    text of task
 * @param {String} task_id   unique id of task
 */
export async function addTask(list_id, text, task_id) {
  const query = {
    text: "INSERT INTO tasks (task_id, list_id, is_done, metadata, created, deleted) VALUES ($1, $2, $3, $4, $5, $6)",
    values: [
      task_id,
      list_id,
      false,
      new TaskMetadata(task_id, text),
      new Date().toUTCString(),
      false,
    ],
  };
  await client.query(query);
  return;
}

/**
 * queries to update previous text of a task with updated_text, having task_id
 * @param {String} task_id    unique id of task
 * @param {String} updated_text   updated text of task
 */
export async function updateTask(task_id, updated_text) {
  const query = {
    text: "UPDATE tasks SET metadata = jsonb_set(metadata, '{text}', $1::jsonb) WHERE task_id = $2",
    values: [JSON.stringify(updated_text), task_id],
  };
  await client.query(query);
  return;
}

/**
 * queries to add a particular task into recycle bin list
 * @param {String} task_id   unique id of task
 * @param {String} recycle_bin_list_id   unique id of recycle bin list
 */
export async function addTaskToRecycleBin(task_id, recycle_bin_list_id) {
  let new_task_id = uuidv4();
  const query = {
    text: "INSERT INTO tasks(task_id, list_id, is_done, metadata, created, deleted) SELECT  $1, $2, is_done, metadata, created, deleted from tasks WHERE task_id = $3 AND is_done = $4",
    values: [new_task_id, recycle_bin_list_id, task_id, false],
  };
  await client.query(query);
  return;
}

/**
 * queries to update deleted property of task as true so that it won't appear in that list
 * @param {String} task_id    unique id of a task
 */
export async function deleteTask(task_id) {
  const query = {
    text: "UPDATE tasks SET deleted= $1 where task_id = $2",
    values: [true, task_id],
  };
  await client.query(query);
  return;
}

/**
 * queries to reverse is_done property of task
 * @param {String} task_id             unique id of task
 * @param {Boolean} currentIsDone      boolean value of task is_done property before changing
 * @returns
 */
export async function reverseIsDone(task_id, currentIsDone) {
  const query = {
    text: "UPDATE tasks SET is_done = $1 WHERE task_id = $2",
    values: [!currentIsDone, task_id],
  };
  await client.query(query);
  return;
}

/**
 * updates deleted property to false so that it can be seen in that list
 * @param {String} root_list_task_id   unique id of task that present task had before deletion
 */
export async function moveTaskToRootList(root_list_task_id) {
  const query = {
    text: "UPDATE tasks SET deleted = $1 WHERE task_id = $2",
    values: [false, root_list_task_id],
  };
  await client.query(query);
  return;
}

/**
 * update deleted property to true so that it won't present in recycle bin anymore
 * @param {String} task_id    unique id of task
 */
export async function removeTaskFromRecycleBin(task_id) {
  const query = {
    text: "UPDATE tasks SET deleted = $1 WHERE task_id = $2",
    values: [true, task_id],
  };
  await client.query(query);
  return;
}

/**
 * delete task from recycle bin list
 * @param {String} task_id   unique id of task
 */
export async function deleteTaskPermanently(task_id) {
  const query = {
    text: "DELETE FROM tasks WHERE task_id = $1",
    values: [task_id],
  };
  await client.query(query);
  return;
}
