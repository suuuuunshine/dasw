const mongoose = require('mongoose')

const dbURL = `mongodb+srv://admin:admin@restaurante-qcpn1.mongodb.net/restaurante?retryWrites=true&w=majority`

function connect() {

    return mongoose.connect(dbURL, {
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
    }).then(() =>{
        console.log("Database Connected");
    }).catch((err) =>{
        console.log("No conectado ",err);
    })
}

module.exports = {
    connect, mongoose
}