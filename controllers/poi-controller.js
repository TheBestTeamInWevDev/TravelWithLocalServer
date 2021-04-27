const poiDao = require("../daos/poi-dao")
const poiModel = require("../models/POI/poi-model")
const usersModel = require("../models/users/users-model")

module.exports = (app) => {

    // const postPoi = (req, res) => {
    //     const poiInfo = req.body;
    //     // dao returns a promise
    //     // find out if user exist, then we can register
    //     console.log("Controller Post Poi: PoiLocation: "+ poiInfo.location +
    //         " PoiId: " +poiInfo.poiID+
    //         " Poi Address " + poiInfo.address)
    //     poiDao.findPoiByPoiID(poiInfo.poiID)
    //         .then((poiObject) => {
    //             if(poiObject!= null && !poiObject.length) {
    //                 console.log("Poi Already Saved, check username list in this POI")
    //                 poiDao.checkPoiWithUsername(poiInfo.poiID, poiInfo.username)
    //                     .then((result) => {
    //                         console.log("Controller result: "+result)
    //                         if (result !== undefined)
    //                         {
    //                             console.log("username found this POI, user already added this POI")
    //                             res.send("User Already Added")
    //                         }else{
    //                             console.log("username not found this POI, add user to this POI")
    //                             poiDao.addUserToPoi(poiInfo)
    //                                 .then(res.send("Poi Exists, Added User"))
    //                         }
    //                     })
    //             } else {
    //                 console.log("Poi does not exist, create new POI")
    //                 poiDao.createPoi(poiInfo)
    //                     .then((newPoi) => {
    //                         res.send(newPoi)
    //                     })
    //             }
    //         })
    // }
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
                    usersModel.findOne({username:poiInfo.username})
                        .then((resultUser) => {
                            poiModel.findOne({poiID: poiInfo.poiID, listOfTravellers: resultUser._id})
                                .then((result) => {
                                    console.log("result: "+result)
                                    if (result !== undefined && result != null)
                                    {
                                        console.log("username found this POI, user already added this POI")
                                        res.send("1")
                                    }else{
                                        console.log("username not found this POI, add user to this POI")
                                        poiDao.addUserToPoi(poiInfo)
                                            .then(res.send("1"))
                                    }
                                })
                        })
                } else {
                    console.log("Poi does not exist, create new POI")
                    poiDao.createPoi(poiInfo)
                        .then((newPoi) => {
                            console.log("Add POI to user and user to POI")
                            res.send("1")
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