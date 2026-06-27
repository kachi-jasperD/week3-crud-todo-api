require("dotenv").config();

const express = require("express");
const logRequest = require("./middleware/logger");
const { createTodoSchema, updateTodoSchema } = require("./schema");
const validateTodo = require("./middleware/validator");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./database/db");
const Todos = require("./models/todos.model");

const app = express();
app.use(express.json()); // Parse JSON bodies

connectDB();

app.use(logRequest); //Custom Middleware for Logging

// let todos = [
//   { id: 1, task: "Learn Node.js", completed: false },
//   { id: 2, task: "Build CRUD API", completed: false },
// ];

// GET Completed Tasks via Query Params – Completed Tasks
app.get("/todos", async (req, res, next) => {
  try {
    let filter = {};

    const { completed } = req.query;

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    const todos = await Todos.find(filter);

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

// GET All – Read
app.get("/todos", async (req, res, next) => {
  try {
    const todos = await Todos.find({});
    res.status(200).json(todos); // Send array as JSON
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post("/todos", validateTodo(createTodoSchema), async (req, res, next) => {
  try {
    const { task, completed } = req.body;
    const newTodo = new Todos({
      task,
      completed,
    });
    await newTodo.save();
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error);
  }
});

// PATCH Update – Partial
app.patch(
  "/todos/:id",
  validateTodo(updateTodoSchema),
  async (req, res, next) => {
    try {
      const todo = await Todos.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE Remove
app.delete("/todos/:id", async (req, res, next) => {
  try {
    const todo = await Todos.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(204).send(); // Silent success
  } catch (error) {
    next(error);
  }
});

// GET Completed Tasks – Completed Tasks
app.get("/todos/completed", (req, res, next) => {
  try {
    const completed = todos.filter((t) => t.completed);
    if (!completed.length)
      return res.status(404).json({ message: "No completed todos found" });
    res.json(completed); // Custom Read!
  } catch (error) {
    next(error);
  }
});

// GET Active Tasks – Uncompleted/Pending Tasks
app.get("/todos/active", (req, res, next) => {
  try {
    const active = todos.filter((t) => !t.completed);
    if (!active.length)
      return res.status(404).json({ message: "No active todos found" });
    res.json(active); // Task Todos Not Yet Completed!
  } catch (error) {
    next(error);
  }
});

// GET By Id – Single Read
app.get("/todos/:id", async (req, res, next) => {
  try {
    const todo = await Todos.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo); // Send array as JSON
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
