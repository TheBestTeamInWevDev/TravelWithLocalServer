const userDao = require("../daos/users-dao")
const poiDao = require("../daos/poi-dao")
const poiModel = require("../models/POI/poi-model")
const usersModel = require("../models/users/users-model")


module.exports = (app) => {

    const register = (req, res) => {
        const credentials = req.body;
        // dao returns a promise
        // find out if user exist, then we can register
        console.log("User Controller Registration: UserName: "+ credentials.username +
            " Password: " +credentials.password+
            " email: " + credentials.email +
            " role: "+ credentials.role)
        userDao.findUserByUsername(credentials.username)
            .then((actualUser) => {
                if(actualUser != null && actualUser.length > 0) {
                    console.log("User registered Found"+ actualUser)
                    // string 0, there is a user
                    // client knows what to check for
                    res.send("0")
                } else {
                    // user is not there
                    userDao.createUser(credentials)
                        .then((newUser) => {
                            console.log("New User registered"+ newUser)
                            req.session['currentUser'] = newUser
                            res.send(newUser)
                        })
                }
            })
    }

    const update = (req, res) => {
        const credentials = req.body;
        // dao returns a promise
        // find out if user exist, then we can register
        console.log("User Controller Update: UserName: "+ credentials.username +
            " Password: " +credentials.password+
            " email: " + credentials.email +
            " role: "+ credentials.role)
        userDao.findUserByUsername(credentials.username)
            .then(() => {
                console.log("before dao.update: " + credentials.email)
                // if(actualUser.length > 0) {
                //     // string 0, there is a user
                //     // client knows what to check for
                //     res.send("0")
                // } else {
                //     // user is not there
                    userDao.updateUser(credentials)
                        // .then(() => {
                        //     req.session['currentUser'] = credentials
                        //     res.send(credentials)
                        //         console.log("after dao.update: " + credentials.email)
                        // })
                        // 出口转内销
                        .then((updatedUser) => {
                            req.session['currentUser'] = credentials
                            res.send(updatedUser)
                            console.log("after dao.update: " + updatedUser.email)
                        })
                // }
            }
            )
    }

    const login = (req, res) => {
        const credentials = req.body;
        console.log("User Controller Login: UserName: "+ credentials.username +
            " Password: " +credentials.password)
        userDao.findUserByCredentials(credentials)
            .then((actualUser) => {
                if(actualUser) {
                    console.log("Successfully Login with username: "+actualUser.username)
                    req.session['currentUser'] = actualUser
                    res.send(actualUser)
                } else {
                    console.log("Login Fail")
                    res.send("0")
                }
            })
    }

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"]
        if (currentUser === undefined) {
            res.send("0")
        }else{
            userDao.findUserByCredentials(currentUser)
                .then((latestUser) => {
                    if (latestUser){
                        // req.session['currentUser'] = latestUser
                        console.log("In Profile: Controller get current user: " + latestUser.username + "'s profile")
                        console.log(latestUser.email)
                        res.send(latestUser)
                    }else{
                        console.log("Controller can not get profile")
                        res.send("0")
                    }
                })
        }

        // if (currentUser){
        //     // req.session['currentUser'] = latestUser
        //     console.log("In Profile: Controller get current user: " + currentUser.username + "'s profile")
        //     console.log(currentUser.email)
        //     res.send(currentUser)
        // }else{
        //     console.log("Controller can not get profile")
        //     res.send("0")
        // }

    }

    const logout = (req, res) => {
        console.log("Controller logout user")
        console.log("Successfully logout")
        req.session["currentUser"] = null
        req.session.destroy()
        res.send("1")
    }

    const findGuidesByLocation = (req, res) => {
        console.log("User Controller findGuidesByLocation")
        const location = req.params.location;
        userDao.findGuidesByLocation(location)
            .then((guides) => {
                if(guides) {
                    console.log("Successfully find guides")
                    res.send(guides)
                } else {
                    console.log("Can not find guides")
                    res.send([])
                }
            })
    }

    const deleteFavouritePlace = (req, res) => {
        const poiID = req.params.poiID;
        const currentUser = req.session["currentUser"]
        console.log("User Controller deleteFavouritePlace poiID" + poiID + " currentUser " + currentUser.username)
        userDao.deletePlaceByUserName(poiID, currentUser)
            .then((result) => {
                if (result){
                    console.log("result from deleteFavouritePlace_1: "+ result)
                    // req.session['currentUser'] = result
                    res.send("1")
                }else{
                    console.log("result from deleteFavouritePlace_0: "+ result)
                    res.send("0")
                }
            })
    }

    // const checkPlaceMarked = (req, res) => {
    //     console.log("User Controller checkPlaceMarked")
    //
    //
    //     const currentUser = req.session["currentUser"]
    //     const poiID = req.params.poiID;
    //     userDao.checkIfUserMarkedPlace(poiID, currentUser)
    //         .then((result) => {
    //             if (result === 1){
    //                 console.log("username found this POI, mark star ")
    //                 console.log("result " + result)
    //                 res.send("1")
    //             }else{
    //                 console.log("username not found this POI, unmark star ")
    //                 console.log("result " + result)
    //                 res.send("0")
    //             }
    //         })
    //     }
    const checkPlaceMarked = (req, res) =>{
        const currentUser = req.session["currentUser"]
        const poiID = req.params.poiID;
        console.log("User Controller checkIfUserMarkedPlace: "+ poiID + " with " + currentUser.username)
        return poiModel.findOne({poiID: poiID})
            .then((resultPlace) => {
                if (resultPlace == null) {
                    console.log("POI does not exist in DB yet " + resultPlace)
                    res.send("0")
                } else {
                    console.log("POI found " + resultPlace.location)
                    usersModel.findOne({username: currentUser.username, favoritePlaces: resultPlace._id})
                        .then((result) => {
                            if (!result) {
                                console.log("POI exists but this user never marked it ")
                                res.send("0")
                            } else {
                                console.log("POI exists and this user marked it " + result)
                                res.send("1")
                            }
                        })
                }
            })
    }

    const findPublicProfile = (req, res) => {
        const username = req.params.username;
        return userDao.findUserByUsername(username)
            .then((result) => {
                res.send(result)
            })
    }

    // why post here?!
    app.get("/api/users/profile", profile);
    app.post("/api/users/register", register);
    app.post("/api/users/update", update);
    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
    app.get("/api/users/findGuides/:location", findGuidesByLocation)
    app.post("/api/users/delete/:poiID", deleteFavouritePlace)
    app.get("/api/users/check/:poiID", checkPlaceMarked)
    app.get("/api/users/publicProfile/:username", findPublicProfile)
}