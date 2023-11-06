/**
 * it is the metadata of every task which contains text of task item and task id when that task is added for the first time ina particular list which will always be same even after replication.
 */
export class TaskMetadata {
    constructor(root_list_task_id, text) {
      this.root_list_task_id = root_list_task_id;
      this.text = text;
    }
  }