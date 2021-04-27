const usersModel = require("../models/users/users-model")
const poiModel = require("../models/POI/poi-model")

const findUserByUsername = (username) => {
    // return usersModel.find({username: username})
    return usersModel.findOne({username})
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
        + " role: "+ credentials.role)
    return usersModel.create({username:credentials.username , password:credentials.password,
        email: credentials.email,role:credentials.role})
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
    updateUser
}