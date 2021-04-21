const mongoose = require('mongoose')
Schema = mongoose.Schema
const usersSchema = Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    favoritePlaces: [
        {
            type: Schema.Types.ObjectId,
            // 对应module.exports = POIModel
            ref: 'POIModel'
        }],
    listOfRequests: [
        {
            type: Schema.Types.ObjectId,
            // 对应module.exports = usersModel
            ref: 'UserModel'
        }],
    role: {
        type: String,
        enum: ['TRAVELLER', 'LOCALGUIDE'],
        required:true
    }
}, {collection: "users"})

module.exports = usersSchema 