const poiModel = require("../models/POI/poi-model")
const usersModel = require("../models/users/users-model")

const findPoiByPoiID = (poiID) => {
    console.log("POI DAO findPoiByPoiID: "+ poiID)
    return poiModel.findOne({
        poiID: poiID
    })
    // return usersModel.find({username})
}

// const checkPoiWithUsername = (poiID, username) => {
//     console.log("POI DAO checkPoiWithUsername: "+ poiID + " with " + username)
//     return usersModel.findOne({username:username})
//         .then((resultUser) => {
//             poiModel.findOne({poiID: poiID, listOfTravellers: resultUser._id})
//                 .then((result) => {
//                     console.log("result: "+result)
//                 })
//         })
// }


// specific to our domain, generic
const createPoi = (poiInfo) => {
    console.log("POI DAO createPoi: PoiLocation: "+ poiInfo.location +
        " PoiId: " +poiInfo.poiID+
        " Poi username " + poiInfo.username)
    const poiObject = new poiModel()
    poiObject.location = poiInfo.location
    poiObject.poiID = poiInfo.poiID
    poiObject.imageURL = poiInfo.imageURL
    poiObject.address = poiInfo.address
    return poiObject.save()
        .then((result) => {usersModel.findOne({username:poiInfo.username}, (err, user) => {
            if (user){
                console.log("DAO Add "+ poiObject.location + " to " + user.username)
                user.favoritePlaces.push(poiObject);
                poiObject.listOfTravellers.push(user);
                user.save();
                poiObject.save();
            }
        })})
}

const addUserToPoi = (poiInfo) => {
    console.log("POI DAO addUserToPoi: PoiLocation: "+ poiInfo.location +
        " PoiId: " +poiInfo.poiID+
        " Poi username " + poiInfo.username)
    return findPoiByPoiID(poiInfo.poiID)
        .then((resultPOI) => {
            usersModel.findOne({username:poiInfo.username}, (err, user) => {
                if (user) {
                    console.log("DAO Add " + poiInfo.location + " to " + user.username)
                    user.favoritePlaces.push(resultPOI);
                    resultPOI.listOfTravellers.push(user);
                    user.save();
                    resultPOI.save();
                }
            })}
        )
}

const findSortedPoiByListOfTravellers = () => {
    console.log("POI DAO findSortedPoiByListOfTravellers");
    return poiModel.aggregate(
        [
            { "$project": {
                    "location": 1,
                    "poiID": 1,
                    "imageURL": 1,
                    "address": 1,
                    "length": { "$size": "$listOfTravellers" }
                }},
            { "$sort": { "length": -1 } },
            { "$limit": 4 }
        ],
        function(err,results) {
            console.log("findSortedPoiByListOfTravellers results: " + results)
            // results in here
            // return results
        }
    )


}




module.exports = {
    findPoiByPoiID,
    createPoi,
    addUserToPoi,
    findSortedPoiByListOfTravellers
    // checkPoiWithUsername
}