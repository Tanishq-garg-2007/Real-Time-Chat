const mongoose = require('mongoose');

const mongoDb = async() =>{
    try {
        await mongoose.connect("mongodb+srv://iit2024038:1234%40abcd@cluster0.rqfco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Mongo Db Connected Successfully");
    } catch (error) {
        console.log("Mongo DB connection failed");
    }
}

module.exports = mongoDb