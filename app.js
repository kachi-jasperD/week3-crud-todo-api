require("dotenv").config();

const express = require("express");
const logRequest = require("./middleware/logger");
const validateTodo = require("./middleware/validator");
const errorHandler = require("./middleware/errorHandler");
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(logRequest); //Custom Middleware for Logging

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: false },
];

// GET All – Read
app.get("/todos", (req, res, next) => {
  try {
    res.status(200).json(todos); // Send array as JSON
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post("/todos", validateTodo, (req, res, next) => {
  try {
    const body = req.body;
    if (!body.task || typeof body.completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "Invalid input: 'task' and 'completed' are required" });
    }
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
    todos.push(newTodo);
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error);
  }
});

// PATCH Update – Partial
app.patch("/todos/:id", (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// DELETE Remove
app.delete("/todos/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
    if (todos.length === initialLength)
      return res.status(404).json({ error: "Not found" });
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
app.get("/todos/:id", (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo); // Send array as JSON
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
