require("dotenv").config();
const turfDistance = require("@turf/distance").default;
const {GOOGLE_MAP_API_KEY:GAT} = process.env;

module.exports = {
    show: (req,res) => {
        if(req.method === "GET"){
            res.locals.apikey = GAT;
            res.render("map");
        }
        if(req.method === "POST"){
            res.json(res.locals.centres);
        } 
    }
}