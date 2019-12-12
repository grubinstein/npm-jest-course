const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb+srv://gabriel:261Wpztd72s1q2mN@todo-tdd-o46r7.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
        console.error("Error connecting to mongodb")
        console.error(err);
    }
}

module.exports = { connect }