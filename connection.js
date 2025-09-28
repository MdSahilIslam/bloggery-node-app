const mongoose = require('mongoose');

async function connectToDb(uri) {
    await mongoose.connect(uri).then(res => {
    console.log("!!---Mongo Db connected----!!")
    })
}

module.exports = {
    connectToDb
}