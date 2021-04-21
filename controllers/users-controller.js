const userDao = require("../daos/users-dao")

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

    app.post("/api/users/profile", profile);
    app.post("/api/users/register", register);
    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
}