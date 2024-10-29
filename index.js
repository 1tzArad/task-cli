#!/usr/bin/env node

const yargs = require("yargs");
const { Database } = require("./controller/databaseController");
const database = new Database();

yargs
  .command(
    "add <task>",
    "create a new task",
    (yargs) => {
      yargs.positional("task", {
        describe: "added task",
        type: "string",
      });
    },
    (argv) => {
      const task = argv.task.trim();
      const createdTask = database.create(task);
      if (createdTask === 409) return console.log("this task already exists!");
      return console.log(`Task added successfully (ID: ${createdTask})`);
    }
  )
  .command(
    "update <id> <title>",
    "update a trask",
    (yargs) => {
      yargs.positional("id", {
        describe: "task id",
        type: "number",
      });
      yargs.positional("title", {
        describe: "new task title",
        type: "string",
      });
    },
    (argv) => {
      const id = argv.id;
      const title = argv.title;
      const updatedTask = database.update(id, title);
      if (updatedTask == 404) return console.log("task not found!");
      console.log(`task updated successfully! (ID: ${updatedTask})`);
    }
  )
  .command(
    "delete <id>",
    "delete a trask",
    (yargs) => {
      yargs.positional("id", {
        describe: "task id",
        type: "number",
      });
    },
    (argv) => {
      const id = argv.id;
      const deletedTask = database.delete(id);
      if (deletedTask == 404) return console.log("task not found!");
      console.log(`task deleted successfully!`);
    }
  )
  .command(
    "list-filter <filter>",
    "list all tasks with filter",
    (yargs) => {
      yargs.positional("filter", {
        describe: "task filter",
        type: "string",
      });
    },
    (argv) => {
      const filter = argv.filter;
      const taskList = database.getAll(filter);
      if (taskList === 404) return console.log("task not found!");
      console.log(taskList);
    }
  )
  .command(
    "list",
    "list all tasks",
    (yargs) => {},
    (argv) => {
      const taskList = database.getAll();
      if (taskList === 404) return console.log("task not found!");
      console.log(taskList);
    }
  )
  .command(
    "mark-done <id>",
    "mark done a trask",
    (yargs) => {
      yargs.positional("id", {
        describe: "task id",
        type: "number",
      });
    },
    (argv) => {
      const id = argv.id;
      const markedTask = database.updateTaskStatus(id, 'DONE')
      if(markedTask === 404) return console.log('task not found!');
      console.log(`Task Marked Successfully! ( ID: ${id} )`)
    }
  )
  .command(
    "mark-in-progress <id>",
    "mark in progress a trask",
    (yargs) => {
      yargs.positional("id", {
        describe: "task id",
        type: "number",
      });
    },
    (argv) => {
      const id = argv.id;
      const markedTask = database.updateTaskStatus(id, 'IN_PROGRESS')
      if(markedTask === 404) return console.log('task not found!');
      console.log(`Task Marked Successfully! ( ID: ${id} )`)
    }
  )
  .help()
  .alias("help", "h").argv;
