const Joi = require("joi");

const createTodoSchema = Joi.object({
  task: Joi.string().min(3).max(100).required(),
  completed: Joi.boolean().default(false),
});

const updateTodoSchema = Joi.object({
  task: Joi.string().min(3).max(100),
  completed: Joi.boolean(),
}).min(1); // Require at least one field to update

module.exports = {
  createTodoSchema,
  updateTodoSchema,
};
