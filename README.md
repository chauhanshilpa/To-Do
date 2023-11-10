# To Do

To Do is a stack web application created using ReactJS and Bootstrap for frontend, express.js for backend and postgreSQL as database. Users can create multiple task lists and add tasks to any list. Tasks can be edited, marked as completed or deleted. The app is fully responsive, so it can be used on any device.

## how to clone to your local machine
 
  Run this command in terminal-
 `git clone https://github.com/chauhanshilpa/To-Do.git`

## Steps to Initialize or Copy the Database

If don't have docker then manually go to SQL shell(psql) or directly go to pgAdmin 4 then open query tool and start from point number 3.

If you have docker then, go to exec (in docker) and run following commands

1.  `bash`

2.  `psql -U postgres`

3.  `CREATE DATABASE todo;`

4.  `\c todo;`

5.  `CREATE TABLE users(user_id UUID PRIMARY KEY, email TEXT, username VARCHAR(30), password VARCHAR(30), created TIMESTAMPTZ);`

6.  `CREATE TABLE list(list_id UUID PRIMARY KEY, user_id UUID references users(user_id), list_name VARCHAR(30), deletable BOOLEAN, created TIMESTAMPTZ, deleted BOOLEAN);`

7.  `CREATE TABLE tasks(task_id UUID PRIMARY KEY, list_id UUID references list(list_id), is_done BOOLEAN, metadata jsonb, created TIMESTAMPTZ, deleted BOOLEAN);`

## Author

This app is developed by Shilpa Chauhan.
