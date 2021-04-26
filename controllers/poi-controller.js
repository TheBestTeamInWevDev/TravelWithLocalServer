const poiDao = require("../daos/poi-dao")

module.exports = (app) => {

    const postPoi = (req, res) => {
        const poiInfo = req.body;
        // dao returns a promise
        // find out if user exist, then we can register
        console.log("Controller Post Poi: PoiLocation: "+ poiInfo.location +
            " PoiId: " +poiInfo.poiID+
            " Poi Address " + poiInfo.address)
        poiDao.findPoiByPoiID(poiInfo.poiID)
            .then((poiObject) => {
                if(poiObject!= null && !poiObject.length) {
                    console.log("Poi Already Saved, check username list in this POI")
                    if (!poiDao.checkPoiWithUsername(poiInfo.poiID, poiInfo.username).length){
                        console.log("username found this POI, user already added this POI")
                        res.send("User Already Added")
                    }else{
                        console.log("username not found this POI, add user to this POI")
                        poiDao.addUserToPoi(poiInfo)
                            .then(res.send("Poi Exists, Added User"))
                    }
                } else {
                    console.log("Poi does not exist, create new POI")
                    poiDao.createPoi(poiInfo)
                        .then((newPoi) => {
                            res.send(newPoi)
                        })
                }
            })
    }

    const findPoiByPoiID = (req, res) => {
        const poiID = req.params.poiID;
        console.log("Controller find POI: "+ poiID)
        poiDao.findPoiByPoiID(poiID)
            .then((actualPoi) => {
                if(actualPoi) {
                    console.log("Successfully find PoI: "+actualPoi.poiID)
                    res.send(actualPoi)
                } else {
                    console.log("Can not find POI")
                    res.send("0")
                }
            })
    }



    app.post("/api/poi/addPoi", postPoi);
    app.get("/api/poi/:poiID", findPoiByPoiID);
}