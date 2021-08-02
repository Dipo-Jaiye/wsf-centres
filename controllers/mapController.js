const {GOOGLE_MAP_API_KEY:GAT} = require("../config/variables");

module.exports = {
    show: (req,res) => {
        if(req.method === "GET"){
            res.locals.apikey = GAT;
            res.render("centres/map");
        }
        if(req.method === "POST"){
            res.json(res.locals.centres);
        } 
    },

    stringify: (req,res,next) => {
        res.locals.centres = JSON.stringify(res.locals.centres);
        next();
    }
}