const userDao = require("../daos/users-dao")
const poiDao = require("../daos/poi-dao")

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
                            req.session['profile'] = newUser
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
            .then((actualUser) => {
                // if(actualUser.length > 0) {
                //     // string 0, there is a user
                //     // client knows what to check for
                //     res.send("0")
                // } else {
                //     // user is not there
                    userDao.updateUser(credentials)
                        .then((updatedUser) => {
                            req.session['profile'] = updatedUser
                            res.send(updatedUser)
                        })
                // }
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
        const currentUser = req.session["currentUser"]
        if (currentUser){
            console.log("Controller get current user: " + currentUser.username + "'s profile")
        }else{
            console.log("Controller can not get profile")
        }
        req.session["currentUser"] = null
        req.session.destroy()
        if (currentUser){
            console.log("Controller get current user: " + currentUser.username + "'s profile")
        }else{
            console.log("Controller can not get profile")
        }
        // // 销毁 session
        // req.session.destroy();
        // // 清除 cookie
        // res.clearCookie(this.cookie, { path: '/' });
        // // 调用 passport 的 logout方法
        // req.logout();
        // // 重定向到首页
        // // res.redirect('/');

        res.send("1")
    }

    const findGuidesByLocation = (req, res) => {
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
        userDao.deletePlaceByUserName(poiID, currentUser)
            .then((result) => {
                if (result){
                    res.send("1")
                }else{
                    res.send("0")
                }
            })
    }

    const checkPlaceMarked = (req, res) => {
        const currentUser = req.session["currentUser"]
        const poiID = req.params.poiID;
        if (!poiDao.checkPoiWithUsername(poiID, currentUser.username).length){
            console.log("username found this POI, mark star")
            res.send("1")
        }else{
            console.log("username not found this POI, unmark star")
            res.send("0")
        }
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