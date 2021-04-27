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
                if(actualUser.length > 0) {
                    // string 0, there is a user
                    // client knows what to check for
                    res.send("0")
                } else {
                    // user is not there
                    userDao.createUser(credentials)
                        .then((newUser) => {
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
        if (currentUser){
            console.log("In Profile: Controller get current user: " + currentUser.username + "'s profile")
            console.log(currentUser.email)
            res.send(currentUser)
        }else{
            console.log("Controller can not get profile")
            res.send("0")
        }
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
        console.log("User Controller deleteFavouritePlace")

        const poiID = req.params.poiID;
        const currentUser = req.session["currentUser"]
        userDao.deletePlaceByUserName(poiID, currentUser)
            .then((result) => {
                if (result){
                    res.send("1")
                }else{
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

    // why post here?!
    app.post("/api/users/profile", profile);
    app.post("/api/users/register", register);
    app.post("/api/users/update", update);
    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
    app.get("/api/users/findGuides/:location", findGuidesByLocation)
    app.delete("/api/users/delete/:poiID", deleteFavouritePlace)
    app.get("/api/users/check/:poiID", checkPlaceMarked)
}