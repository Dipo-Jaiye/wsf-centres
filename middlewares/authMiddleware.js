module.exports = {
    authCheck: (req,res,next) => {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.currentUser = req.user;
        next();
    }
}