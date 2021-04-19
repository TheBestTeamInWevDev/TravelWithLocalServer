const mongoose = require('mongoose')
const poiSchema = mongoose.Schema({
    name: {type: String},
    WeekdayHours: [
        {
            type: String
        }],
    listOfRequests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    Location: {
        type: String
    }
}, {collection: "poi"})

module.exports = poiSchema