const mongoose = require("mongoose")
const usersSchema = require("./poi-schema")
const poiModel = mongoose.model("POIModel", usersSchema)
module.exports = poiModel