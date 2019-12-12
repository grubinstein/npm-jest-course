const request = require("supertest")
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
const nonexistantTodoId = "5def6ba0b0db6b2f5754f142";
const testData = { title: "Make integration test for PUT", done: true };

let firstTodo;
let newTodoId;

describe(endpointUrl, () => {
    test("GET " + endpointUrl, async () => {
        const response = await request(app)
        .get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    });
    test("GET by Id " + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + firstTodo._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    })
    test("GET by ID doesn't exist " + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl + nonexistantTodoId);
        expect(response.statusCode).toBe(404);
    });
    test("POST " + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        newTodoId = response.body._id;
    });
    it("should return error 500 on malformed data with POST " + endpointUrl, async () => {
        const response = await request(app).post(endpointUrl).send({title: "Missing done property"});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({message: "Todo validation failed: done: Path `done` is required."})
    });
    test("PUT " + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + newTodoId)
            .send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    test("PUT ID doesn't exist " + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + nonexistantTodoId)
            .send(testData)
        expect(response.statusCode).toBe(404);
    });
    test("HTTP DELETE " + endpointUrl, async () => {
        const response = await request(app)
            .delete(endpointUrl + newTodoId)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    test("HTTP DELETE todo not found " + endpointUrl, async () => {
        const response = await request(app)
            .delete(endpointUrl + nonexistantTodoId)
            .send();
        expect(response.statusCode).toBe(404);
    })
});