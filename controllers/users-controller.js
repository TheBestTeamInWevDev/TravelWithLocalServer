const userDao = require("../daos/users-dao")

module.exports = (app) => {

    const register = (req, res) => {
        const credentials = req.body;
        // dao returns a promise
        // find out if user exist, then we can register
        console.log("User Controller Registration: UserName: "+ credentials.username +
            " Password: " +credentials.password+
            " email: " + credentials.email +
            " role: "+ credentials.role+
            " location: "+ credentials.location)
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
                            req.session['profile'] = newUser
                            res.send(newUser)
                        })
                }
            })
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
            console.log("Controller get current user: " + currentUser.username + "'s profile")
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
        const location = req.params.location;
        console.log("findGuidesByLocation: " + location)
        userDao.findGuidesByLocation(location)
            .then((guides) => {
                if(guides) {
                    console.log("Successfully find guides" + JSON.stringify(guides))
                    res.send(guides)
                } else {
                    console.log("Can not find guides")
                    res.send([])
                }
            })
    }

    const publicProfile = (req, res) => {
        const guideName = req.params.username;
        console.log("publicProfile"+ guideName)
        userDao.findUserByUsername(guideName)
            .then((user) => {
                if(user) {
                    console.log("Successfully find user" + JSON.stringify(user))
                    res.send(user)
                } else {
                    console.log("Can not find user")
                    res.send([])
                }
            })
    }


    const requestGuide = (req, res) => {
        const userName = req.params.username;
        const guideName = req.params.guidename;

        console.log("userName: " + userName + " requestGuide: "+ guideName)
        userDao.findUserByUsername(userName)
            .then((user) => {
                if (user){
                    userDao.findUserByUsername(guideName)
                        .then((guideUser) => {
                            if (guideUser){
                                if (!userDao.checkIfGuideRequested(userName,guideName).length){
                                    console.log("Guide name found in this user, user already added")
                                    res.send("1")
                                }else{
                                    user.listOfRequests.push(guideUser);
                                    guideUser.listOfRequests.push(user);
                                    guideUser.save();
                                    user.save();
                                    console.log("Request Success")
                                    res.send("1")
                                }
                            }else{
                                console.log("Request Failed")
                                res.send("0")
                            }
                        }
                        )
                }else{
                    console.log("Request Failed")
                    res.send("0")
                }
            })
    }

    app.post("/api/users/profile", profile);
    app.post("/api/users/register", register);
    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
    app.get("/api/users/findGuides/:location", findGuidesByLocation)
    app.get("/api/users/publicProfile/:username", publicProfile)
    app.post("/api/users/:username/request/:guidename", requestGuide)
}