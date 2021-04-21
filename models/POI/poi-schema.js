const mongoose = require('mongoose')
Schema = mongoose.Schema
const poiSchema = Schema({
    name: {type: String},
    PoiID: {type: String},
    imageURL: {type: String},
    WeekdayHours: [
        {
            type: String
        }],
    Location: {
        type: String
    },
    listOfRequests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    listOfLocals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
}, {collection: "poi"})

module.exports = poiSchema