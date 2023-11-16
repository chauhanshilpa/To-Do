# To Do

## Description

To Do is a full stack web application created using [ReactJS](https://react.dev/). [Bootstrap](https://getbootstrap.com/) for frontend styling, [express.js](https://expressjs.com/) for backend and [postgreSQL](https://www.postgresql.org/) as database. Users can create multiple task lists and add tasks to any list. Tasks can be edited, marked as completed or deleted. The app is fully responsive, so it can be used on any device.

## Privacy Policy

This application prioritizes user privacy, ensuring that only the account holder has access to their to-do lists. Your information is kept confidential and secure.

## Steps to Initialize or Copy the Database
 
### If Docker is installed
If you have docker then, go to postgres exec (in docker) and run following commands-

1.  `bash`

2.  `psql -U postgres`

3.  `CREATE DATABASE todo;`

4.  `\c todo;`

5.  `CREATE TABLE users(user_id UUID PRIMARY KEY, email TEXT, username VARCHAR(30), password VARCHAR(30), created TIMESTAMPTZ);`

6.  `CREATE TABLE list(list_id UUID PRIMARY KEY, user_id UUID references users(user_id), list_name VARCHAR(30), deletable BOOLEAN, created TIMESTAMPTZ, deleted BOOLEAN);`

7.  `CREATE TABLE tasks(task_id UUID PRIMARY KEY, list_id UUID references list(list_id), is_done BOOLEAN, metadata jsonb, created TIMESTAMPTZ, deleted BOOLEAN);`

### If Docker is not installed
If you don't have docker then manually go to pgAdmin 4 and open query tool or go to SQL shell(psql) and start from point number 3(above). Now go to api folder, in dbConnectionString change the connectionString to `"postgressql://postgres:password@localhost:5432/todo"` 

## How to run the application?

Clone repository, run the command `npm install` and then `run npm start`

## User Interface Overview

The application features a user-friendly interface with a navbar providing links to the main screen, login, signup, and a theme-changing icon.

Upon running the application, users encounter a signup form initially. New users must sign up with their email, username, and password, which is then saved in the system's database. Existing users can switch to the login form using the navbar link or the provided link within the signup form.

After successful signup, users are directed to the To-Do main application. The default home page displays tasks, and a sidebar includes two default lists, along with an input for adding new lists.

Upon logging in with correct credentials, users gain access to their personalized to-do items, providing a seamless and intuitive experience for task management.

## Usage Instructions

Upon successful login or signup, users gain the ability to create and manage different to-do lists. They can seamlessly switch between lists and delete them as needed. Items created within a list remain exclusive to that list.

Within each list, users can perform various actions on to-do items, such as deletion, editing, or marking as done. If a to-do item is deleted, it is transferred to the recycle bin. From the recycle bin, users can restore items, sending them back to their original list. Permanent deletion from the recycle bin removes the item entirely.

Marking a to-do item as done triggers a sound and visually updates the text decoration with a line-through. If a done item is subsequently deleted, it is permanently removed, bypassing the recycle bin.





