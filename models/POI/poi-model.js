const mongoose = require("mongoose")
const poiSchema = require("./poi-schema")
const poiModel = mongoose.model("POIModel", poiSchema)
module.exports = poiModel