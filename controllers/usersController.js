const User = require("../models/user");
const passport = require("passport");

module.exports = {
    registerView: (req, res) => {
        res.render("users/register");
    },

    loginView: (req,res) => {
        res.render("users/login");
    },

    register: async (req,res) => {
        const {email, password} = req.body;
        User.register({email},password, (err, user) => {
            if(user){
                res.locals.user = user;
                res.redirect("/");
            }
            else {
                console.log("didn't register");
                console.log(err.message);
                res.redirect("/users/new");
            }
        })
    },

    login: passport.authenticate("local",{
            successRedirect:"/",
            failureRedirect:"/users/login"
        }),

    logout: (req,res) => {
        req.logout();
        res.redirect("/");
    },

    show: async (req,res) => {
        res.render("users/show"); 
    },

    edit: async (req,res) => {
        res.render("users/edit");
    },

    update: async (req,res) => {

    },

    del: async (req,res) => {

    }
}
