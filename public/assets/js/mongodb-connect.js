const mongoose = require('mongoose')
let dbName = "ProyectoComida"
let pass = "roSXjs6D9vdTWQ9A"
let user = "dbUser"

const dbURL = `mongodb+srv://${user}:${pass}@cluster0-q55ie.mongodb.net/${dbName}?retryWrites=true&w=majority`


function connect() {

    return mongoose.connect(dbURL, {
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
    }).then(() =>{
        console.log("Connected");
    }).catch((err) =>{
        console.log("No conectado ",err);
    })
}

module.exports = {
    connect, mongoose
}