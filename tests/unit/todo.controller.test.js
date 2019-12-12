const TodoController = require("../../controllers/todo.controller")
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");
const { catchErrors } = require("../../handlers/errorHandlers");

jest.mock("../../model/todo.model");

let req, res, next;
const todoId = "5def6ba0b0db6b2f5754f183";

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
})

describe("TodoController.createTodo", () => {
	const createTodo = catchErrors(TodoController.createTodo);
	beforeEach(() => {
		req.body = newTodo;
	});
	it("should have a createTodo function", () => {
		expect(typeof createTodo).toBe("function");
	});
	it("should call TodoModel.create", () => {
		createTodo(req, res, next);
		expect(TodoModel.create).toBeCalledWith(newTodo);
	});
	it("should return 201 response code", async () => {
		await createTodo(req, res, next);
		expect(res.statusCode).toBe(201);
		expect(res._isEndCalled()).toBeTruthy();
	});
	it("should return json body in response", async () => {
		TodoModel.create.mockReturnValue(newTodo);
		await createTodo(req, res, next);
		expect(res._getJSONData()).toStrictEqual(newTodo);
	});
	it("should handle errors", async () => {
		const errorMessage = { message: "Done property missing"};
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.create.mockReturnValue(rejectedPromise);
		await createTodo(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
});

describe("TodoController.getTodos", () => {
	const getTodos = catchErrors(TodoController.getTodos);
	it("should have a getTodos function", () => {
		expect(typeof getTodos).toBe("function");
	});
	it("should call TodoModel.find", async () => {
		await getTodos(req, res, next);
		expect(TodoModel.find).toBeCalledWith({});
	});
	it("should return response with status 200 and all todos", async () => {
		TodoModel.find.mockReturnValue(allTodos);
		await getTodos(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(allTodos);
	});
	it("should handle errors", async () => {
		const errorMessage = { message: "Error getting todos"};
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.find.mockReturnValue(rejectedPromise);
		await getTodos(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
});

describe("TodoController.getTodoById", () => {
	const getTodoById = catchErrors(TodoController.getTodoById);
	it("should have a getTodoById function", () => {
		expect(typeof getTodoById).toBe("function");
	});
	it("should call TodoModel.findById with route parameters", async () => {
		req.params.todoId = "5def6ba0b0db6b2f5754f183";
		await getTodoById(req, res, next);
		expect(TodoModel.findById).toBeCalledWith(todoId);
	});
	it("should return json body and response code 200", async () => {
		TodoModel.findById.mockReturnValue(newTodo);
		await getTodoById(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(newTodo);	
	});
	it("should handle errors", async () => {
		const errorMessage = { message: "Error finding todo" };
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.findById.mockReturnValue(rejectedPromise);
		await getTodoById(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
	it("should return status code 404 if todo is not found", async () => {
		TodoModel.findById.mockReturnValue(null);
		await getTodoById(req, res, next);
		expect(res.statusCode).toBe(404);
		expect(res._isEndCalled()).toBeTruthy;
	});
});

describe("TodoController.updateTodo", () => {
	const updateTodo = catchErrors(TodoController.updateTodo);
	it("should have a updateTodo function", () => {
		expect(typeof updateTodo).toBe("function");
	});
	it("shoud call TodoModel.findByIdAndUpdate with data", async () => {
		req.params.todoId = todoId;
		req.body = newTodo;
		await updateTodo(req, res, next);
		expect(TodoModel.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {
			new: true,
			useFindAndModify: false
		});
	});
	it("should return the updated todo", async () => {
		TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
		await updateTodo(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(newTodo);
	});
	it("should handle errrors", async () => {
		const errorMessage = { "message" : "There is an error" };
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
		await updateTodo(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
	it("should return 404 if todo is not found", async () => {
		TodoModel.findByIdAndUpdate.mockReturnValue(null);
		await updateTodo(req, res, next);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res.statusCode).toBe(404);
	});
});

describe("TodoController.deleteTodo", () => {
	const deleteTodo = catchErrors(TodoController.deleteTodo);
	it("should have a deleteTodo function", () => {
		expect(typeof deleteTodo).toBe("function");
	});
	it("should call TodoModel.findByIdAndDelete with id", async () => {
		req.params.todoId = todoId;
		await deleteTodo(req, res, next);
		expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
	});
	it("should return the deleted todo", async () => {
		TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
		await deleteTodo(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(newTodo);
	});
	it("should handle errors", async () => {
		const errorMessage = { "message" : "some error" };
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
		await deleteTodo(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
	it("should return 404 if todo not found", async () => {
		TodoModel.findByIdAndDelete.mockReturnValue(null);
		await deleteTodo(req, res, next);
		expect(res.statusCode).toBe(404);
		expect(res._isEndCalled).toBeTruthy();
	});
});