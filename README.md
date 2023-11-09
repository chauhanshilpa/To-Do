# To Do 

To Do is a task management app where you can set and mark your tasks.

## How you can use

To use this app, follow these steps:

1) Clone this repository to your local machine using git clone https://github.com/chauhanshilpa/To-Do.git
2) Open the index.html file in your browser.
3) add your To Dos.

## Steps to Initialize or Copy the Database

 Go to psql terminal and run below commands-

1) CREATE DATABASE todo;

2) CREATE TABLE users(user_id UUID PRIMARY KEY, email TEXT, username VARCHAR(30), password VARCHAR(30), created TIMESTAMPTZ);

3) CREATE TABLE list(list_id UUID PRIMARY KEY, user_id UUID references users(user_id), list_name VARCHAR(30), deleteable BOOLEAN, created TIMESTAMPTZ, deleted BOOLEAN);

4) CREATE TABLE tasks(task_id UUID PRIMARY KEY, list_id UUID references list(list_id), is_done BOOLEAN, metadata jsonb, created TIMESTAMPTZ, deleted BOOLEAN);

## how to use app

To Do app is simple to use:

1) Add a task in input feild then press enter.Now you can see your tasks in My Notes.
2) When clicking leftmost tick icon you will see task is done having cut text.You can edit by clicking edit icon on right side and you can delete the task by clicking bin icon.

## Credits

This app is created using Javascript's React library .The components style was obtained from bootstrap framework of CSS and some custom CSS is also applied according to need.

## Future Development

Future updates to the app may include:

1) sign-in form if already a user and register form id user is new.Only the user would see his/her notes with correct credentials.

## Author

This app is developed by Shilpa Chauhan. Contact me at chauhanshilpa602@gmail.com for any questions or feedback.
