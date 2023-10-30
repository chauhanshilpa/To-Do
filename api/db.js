import { client } from "./index.js";
import { v4 as uuidv4 } from "uuid";
import { taskMetadata } from "./DbClassModels.js";

// db.js contains all functions which sends queries to database

/**
 *
 * @returns all sidebar lists
 */
export async function getSidebarList() {
  const query = {
    text: "SELECT * FROM list WHERE deletable = $1 AND deleted = $2",
    values: [true, false],
  };
  const response = await client.query(query);
  return response.rows;
}

/**
 *
 * @param {String} list_id   unique id of list
 * @returns name of list having list_id
 */
export async function getListName(list_id) {
  const query = {
    text: "SELECT list_name FROM list WHERE list_id = $1",
    values: [list_id],
  };
  let res = await client.query(query);
  return res.rows[0].list_name;
}

/**
 *
 * @param {String} list_id   unique id of list
 * @returns list of tasks having list_id
 */
export async function getTaskList(list_id) {
  const query = {
    text: "SELECT * FROM tasks WHERE list_id = $1 AND deleted = $2 ORDER BY created DESC",
    values: [list_id, false],
  };
  let res = await client.query(query);
  return res.rows;
}

/**
 *
 * add new list into the database having columns list_id, user_id, list_name, deletable(can be deleted or not), created(date of creation of list), deleted(deleted or exists)
 * @param {String} list_id    unique id of list
 * @param {String} user_id    unique id of a user
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
 *
 * changes list deleted value to true so that it won't present in sidebar
 * @param {String} list_id   unique id of list
 */
export async function deleteSidebarList(list_id) {
  const query = {
    text: "UPDATE list SET deleted = $1 WHERE list_id = $2",
    values: [true, list_id],
  };
  await client.query(query);
  return;
}

/**
 *
 * Add new task in tasks table of database having columns task_id, list_id, is_done(true or false), metadata(have originated list and its text), created(date of creation of task) and deleted(deleted or exists)
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
      new taskMetadata(list_id, text),
      new Date().toUTCString(),
      false,
    ],
  };
  await client.query(query);
  return;
}

/**
 *
 * update previous text of a task with updated_text, having task_id
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
 * add a particular task into recycle bin list
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
 *
 * updates deleted property of task as true so that it won't present in that list
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
 * reverse is_done property of task
 * @param {String} task_id
 * @param {Boolean} currentIsDone
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
 *
 * updates deleted property to false so that it can be seen in that list
 * @param {String} root_list_id   unique id of list with which task belongs to initially
 */
export async function moveTaskToRootList(root_list_id) {
  const query = {
    text: "UPDATE tasks SET deleted = $1 WHERE list_id = $2",
    values: [false, root_list_id],
  };
  await client.query(query);
  return;
}

/**
 *
 * update deleted property to true so that it won't present in recycle bin anymore
 * @param {String} task_id   unique id of task
 * @param {String} root_list_id   unique id of a list to which task belongs initially before deletion
 */
export async function MoveTaskFromRecycleBin(task_id) {
  const query = {
    text: "UPDATE tasks SET deleted = $1 WHERE task_id = $2",
    values: [true, task_id],
  };
  await client.query(query);
  return;
}

/**
 *
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
