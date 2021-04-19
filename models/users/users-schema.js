const mongoose = require('mongoose')
const usersSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    role: {type: String, enum: ['TRAVELLER', 'LOCALGUIDE']}
}, {collection: "users"})

module.exports = usersSchema 