const mongoose = require('mongoose')
Schema = mongoose.Schema
const poiSchema = Schema({
    location: {
        type: String,
        required: true
    },
    poiID: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    weekdayHours: [
        {
            type: String
        }],
    address: {
        type: String,
        required: true
    },
    listOfTravellers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'UserModel'
        }],
    listOfLocals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'UserModel'
        }]
}, {collection: "poi"})

module.exports = poiSchema