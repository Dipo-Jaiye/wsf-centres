const {GOOGLE_MAP_API_KEY:GAT} = require("../config/variables");

module.exports = {
    show: (req,res) => {
        res.locals.apikey = GAT;
        res.render("centres/map");
    },

    stringify: (req,res,next) => {
        res.locals.centres = JSON.stringify(res.locals.centres);
        next();
    }
}