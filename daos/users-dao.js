const usersModel = require("../models/users/users-model")
const poiModel = require("../models/POI/poi-model")

const findUserByUsername = (username) => {
    // return usersModel.find({username: username})
    return usersModel.findOne({
        username: username
    })
}

const findUserByCredentials = (credentials) => {
    console.log("User DAO Login findUserByCredentials: "+ credentials.username +
        " Password: " +credentials.password)
    return usersModel.findOne({
        username: credentials.username,
        password: credentials.password
    }).populate("favoritePlaces", poiModel).exec()
    // return usersModel.find({username})
}

// specific to our domain, generic
const createUser = (credentials) => {
    console.log("User DAO createUser: UserName: "+ credentials.username
        + " Password: " +credentials.password
        + " email: " + credentials.email
        + " role: "+ credentials.role
        + " location: "+ credentials.location)
    return usersModel.create({username:credentials.username ,
        password:credentials.password,
        email: credentials.email,
        role:credentials.role,
        location:credentials.location})
}

const findGuidesByLocation = (location) => {
    return usersModel.find({
        role: "LOCALGUIDE",
        location: location
    })
}


const checkIfGuideRequested = (username, guidename) => {
    console.log("User DAO checkIfGuideRequested: "+ username + " with " + guidename)
    return usersModel.findOne({username:username})
        .then((resultUser => {
            usersModel.findOne({username:guidename}, {listOfRequests: resultUser})
        }))

}
module.exports = {
    findUserByUsername,
    findUserByCredentials,
    createUser,
    findGuidesByLocation,
    checkIfGuideRequested
}