const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
};

exports.getTodos = async (req, res, next) => {
    const allTodos = await TodoModel.find({});
    res.status(200).json(allTodos);
};

exports.getTodoById = async (req, res, next) => {
    const todo = await TodoModel.findById(req.params.todoId);
    if(!todo) { return res.status(404).send(); }
    res.status(200).json(todo);
}

exports.updateTodo = async (req, res, next) => {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
    req.params.todoId,
    req.body,
    {
        new: true,
        useFindAndModify: false
    });
    if(!updatedTodo) { return res.status(404).send(); }
    res.status(200).json(updatedTodo);
}

exports.deleteTodo = async (req, res, next) => {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.todoId);
    if(!deletedTodo) { return res.status(404).send(); }
    res.status(200).json(deletedTodo);
}