const mongoose = require('mongoose');

const mongoDb = async() =>{
    try {
        await mongoose.connect("mongodb+srv://iit2024038:SdFBKj2nlMZDRO7W@cluster0.v0oewko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Mongo Db Connected Successfully");
    } catch (error) {
        console.log("Mongo DB connection failed");
    }
}

module.exports = mongoDb