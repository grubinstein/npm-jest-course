const express = require("express")
const todoController = require("../controllers/todo.controller")
const router = express.Router();
const { catchErrors } = require("../handlers/errorHandlers");

router.post("/", catchErrors(todoController.createTodo))
router.get("/", catchErrors(todoController.getTodos));
router.get("/:todoId", catchErrors(todoController.getTodoById));
router.put("/:todoId", catchErrors(todoController.updateTodo));
router.delete("/:todoId", catchErrors(todoController.deleteTodo));

module.exports = router;