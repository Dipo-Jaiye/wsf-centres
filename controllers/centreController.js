const {GOOGLE_MAP_API_KEY:GAT} = require("../config/variables");
const Centre = require("../models/centre");
const User = require('../models/user');
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});

// Function to convert form input to an array
async function createArr(val){
    return /,/.test(val) ? val.split(",").map(v => v.trim()) : new Array(val.trim());
}

async function geocode(value){
    let response = await client.geocode({
        params:{
            address: value,
            region: "NG",
            key: GAT
        }
    })

    if(response.data.status === "OK"){
        const latlng = response.data.results[0].geometry.location;
        const place_id = response.data.results[0].place_id;
        return {latlng, place_id};
    } else {
        console.log("Didn't find address for %s, the status was %s",value,response.data.status);
        return {"latlng":"empty","place_id":"empty"};
    }
}

async function reverse_geocode(value){
    try{
        let response = await client.reverseGeocode({
            params:{
                latlng:{ lat: value[0], lng: value[1] },
                key: GAT
            }
        })
    
        if(response.data.status == "OK"){
            const address = response.data.results[0].formatted_address;
            const place_id = response.data.results[0].place_id;
            return {address, place_id};
        } else {
            console.log(`Reverse geocoding result status not OK for ${value}`);
            return;
        }
    } catch { err => {
        console.error(err.message);
        return;
    }}
    
}

module.exports = {
    create: async (req,res,next) => {
        let {name,contact,phone,address} = req.body;
        contact = await createArr(contact);
        phone = await createArr(phone);
        const {latlng, place_id} = await geocode(address);
        try {
            await Centre.create({
                    name,
                    contact,
                    phone,
                    address,
                    latlng,
                    place_id
                })
                .then(cent => {
                    console.log("Centre created");
                    res.redirect(`/map/?id=${cent._id}`);
                })
                .catch(err => {
                    console.error(err);
                    res.redirect("/centre");
                })
                
        }
        catch {e =>
            console.error(e);
            res.redirect("/");
        } 
    },

    update: async (req,res) => {
        let {name,contact,phone,address,id} = req.body;
        contact = await createArr(contact);
        phone = await createArr(phone);
        await Centre.findByIdAndUpdate(id,{$set:{
            name,
            address,
            contact,
            phone
        }},{new:true})
        .then((update)=>{
            if(!update) throw new Error("ID for update not found");
            console.log("updated");
            res.redirect("/");
        })
        .catch(err => {
            res.redirect(`/centre/${id}/edit`);
            console.error(err);
        })

    },

    retrieve: async (req,res,next) => {
        const id = req.query.id;
        const searchTerm = req.query.s;
        let centres;
        res.locals.search = false;
        try {
            if(id){
                centres = await Centre.findById(id);
            } else if (searchTerm) {
                const searchRegex = new RegExp(searchTerm);
                centres = await Centre.find({name:searchRegex});
                res.locals.search = true;
            } else {
                centres = await Centre.find({});
            }
            res.locals.centres = centres;
            next();
        } catch {err => {
            next(err);
        }}
        
    },

    record: (req,res) => {
        res.render("centres/new");
    },

    edit: async (req,res,next) => {
        const id = req.params.id;
        Centre.findById(id)
        .then(centre => {
            res.render("centres/edit",{centre});
        })
        .catch(err => {
            next(err);
            res.redirect("/");
        })
    },

    location_edit: (req,res) => {
        if(res.locals.centres.length == 1){
            res.locals.apikey = GAT;
            res.render("centres/location_edit");
        }
        else{
            res.redirect("/");
        }
    },

    register: async (req, res) => {
        res.render("centres/register");
    },

    location_update: async (req,res)=> {
        let id = req.query.id;
        let {address, location} = req.body;
        if(address){
            const {latlng, place_id} = await geocode(address);
            if(latlng && place_id){
                try{
                    let updated = await Centre.findByIdAndUpdate(id,{$set:{
                        latlng,
                        place_id,
                        address
                    }},{new:true});
                    res.redirect(`/map?id=${updated._id}`);
                } catch {err => {
                    console.error(err.message);
                    res.redirect(`/centre/locate/edit?id=${id}`);
                }} 
            }
        }
        else if(location){
            try{
                const loc_val = location.split(",").map(v => parseFloat(v.trim()));
                let {address, place_id} = await reverse_geocode(loc_val);
                if(address){
                    const latlng = {lat: loc_val[0], lng: loc_val[1]};
                    let updated = await Centre.findByIdAndUpdate(id, {$set:{
                        address,
                        latlng,
                        place_id
                    }}, {new:true});
                    res.redirect(`/map?id=${updated._id}`);
                }
            }
            catch {err => {
                console.error(err.message);
                res.redirect("/");
            }}
        }
        else {
            res.redirect("/");
        }
    }
}
