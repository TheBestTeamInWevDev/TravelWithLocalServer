const usersModel = require("../models/users/users-model")
const poiModel = require("../models/POI/poi-model")
const poiDao = require("../daos/poi-dao")

const findUserByUsername = (username) => {

    // return usersModel.find({username: username})
    return usersModel.findOne({username: username})
}

const findUserByCredentials = (credentials) => {
    console.log("User DAO Login findUserByCredentials: "+ credentials.username +
        " Password: " +credentials.password)
    return usersModel.findOne({
        username: credentials.username,
        password: credentials.password
    }).populate("favoritePlaces", poiModel).populate("listOfRequests").exec()
    // return usersModel.find({username})
}

// specific to our domain, generic
const createUser = (credentials) => {
    console.log("User DAO createUser: UserName: "+ credentials.username
        + " Password: " +credentials.password
        + " email: " + credentials.email
        + " role: "+ credentials.role)
    return usersModel.create({username:credentials.username , password:credentials.password,
        email: credentials.email,role:credentials.role, location:credentials.location})
}
// Mongoose's findOneAndUpdate() is slightly different from the MongoDB Node.js driver's findOneAndUpdate()
// because it returns the document itself, not a result object.
const updateUser = (credentials) => {
    console.log("User DAO createUser: UserName: "+ credentials.username
        + " Password: " +credentials.password
        + " email: " + credentials.email
        + " role: "+ credentials.role)
    // return value false
    return usersModel.findOneAndUpdate({
            username: credentials.username
        },
        {password:credentials.password, email: credentials.email},
        {
            new: true
        }
    )

    // findOne({
    //     username: credentials.username,
    //     password: credentials.password
    // }).

    // {username:credentials.username, password:credentials.password, email: credentials.email, role:credentials.role}
}

const findGuidesByLocation = (location) => {
    return usersModel.find({
        role: "LOCALGUIDE",
        location: location
    })
}


const checkIfGuideRequested = (currentUser, guidename) => {
    console.log("User DAO checkIfGuideRequested: "+ currentUser.username + " with " + guidename)
    return usersModel.findOne({username:guidename, listOfRequests: currentUser._id})
                .then((result) => {
                    if (result == null){
                        console.log("result not find" + result)
                        return 0
                    }else{
                        console.log("result find" + result)
                        return 1
                    }
                })
}



const deletePlaceByUserName = (poiID, currentUser) => {
    return poiDao.findPoiByPoiID(poiID)
        .then((poiObject) => {
            console.log("User DAO deletePlaceByUserName: "+ currentUser.name + " with " + poiObject.location)
            usersModel.findOneAndUpdate({username: currentUser.username}, { $pull: {favoritePlaces: poiObject._id} }, {new: true},(err, data) => {
                if (err) {
                    console.log("Fail to delete favourite places in user schema")
                    // return 0;
                }
                poiModel.findOneAndUpdate({poiID: poiObject.poiID}, { $pull: {listOfTravellers: currentUser._id}}, {new: true},(err, data) => {

                    if (err) {
                        console.log("Fail to delete list of  travellers in places")
                        // return 0;
                    }
                    console.log("delete list of  travellers in places")
                    //
                    // return 1;
                });
                console.log("delete favourite places in user schema")
                // return 1;
            });
        })
}

const addToListOfRequests = (userName, guideName) =>{
    console.log("User Dao addToListOfRequests")
    return usersModel.findOne({username:userName}, (err, user) => {
        if (user){
            usersModel.findOne({username:guideName}, (err, guide) => {
                if (guide) {
                    console.log("DAO Add " + user.username + " to " + guide.username + "listOfRequests")
                    user.listOfRequests.push(guide);
                    guide.listOfRequests.push(user);
                    user.save();
                    guide.save();
                }
            })
        }
    })

}

module.exports = {
    findUserByUsername,
    findUserByCredentials,
    createUser,
    findGuidesByLocation,
    updateUser,
    checkIfGuideRequested,
    deletePlaceByUserName,
    addToListOfRequests
}