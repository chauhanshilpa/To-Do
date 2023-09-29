export class TasksList {
    constructor(metadata) {
      this.list = [];
      this.metadata = metadata;
    }
  }
  
  export class TasksListMetadata {
    constructor(listName, pathName, deletable) {
      this.listName = listName;
      this.pathName = pathName;
      this.deletable = deletable;
    }
  }
  
  export class Task {
    constructor(uuid, text, done) {
      this.uuid = uuid;
      this.text = text;
      this.date = new Date().toDateString();
      this.done = done;
    }
  }
  
  export class SidebarDynamicList {
    constructor(uuid, name) {
      this.uuid = uuid;
      this.name = name;
    }
  }
  
  export class DeletedItemDetails {
    constructor(pathName, task) {
      this.pathName = pathName;
      this.task = task;
    }
  }
  