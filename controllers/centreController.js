require("dotenv").config();
const {GOOGLE_MAP_API_KEY:GAT} = process.env;
const Centre = require("../models/centre");
const User = require('../models/user');
const fs = require("fs");
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
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
    value = value.split(",").map(v=> parseFloat(v.trim()));
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
        try{
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
                    res.redirect("/");
                })
                .catch(err => {
                    console.error(err);
                    res.redirect("/centre");
                })
                
            }
            catch{e =>
            console.error(e)
            } 
    },

    edit: async (req,res) => {
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
        console.log("retrieve is triggered");
        const ind = req.query.id;
        await Centre.find({})
        .then(centres => {
            centres = ind ? centres.filter(centre => centre._id == ind) : centres;
            res.locals.centres = centres;
            next();
        })
        .catch(error => {
            next(error);
        })
    },

    record: (req,res) => {
        res.render("new");
    },

    seed: (req,res,next) => {
        fs.readFile("./controllers/centers6.json",async (err, data) => {
            if (err) next(err);
            data = await JSON.parse(data);
            let count = 1;
            data.features.forEach(center => {
               let {name, address, contact_info, phone} = center.properties;
               async function arrayIFY(value){
                   if(typeof value === "string"){
                       console.log("Arrayify %s",value);
                       return Array(value);
                   }
                   else{
                       return value;
                   }
               }
               arrayIFY(contact_info)
               .then(va => {
                   contact_info = va;
                   return arrayIFY(phone);
               })
               .then(ri => {
                    phone = ri;
                    return Centre.create({
                        name,
                        address,
                        contact:contact_info,
                        phone
                    });
               })
               .then(()=>{
                    console.log(`Center number ${count} is created`);
                    count += 1;
                })
                .catch(err => {
                    console.error(err);
                })
            });
        });
        res.status(200).end();
    },

    show: async (req,res,next) => {
        const id = req.params.id;
        Centre.findById(id)
        .then(centre => {
            res.render("edit",{centre});
        })
        .catch(err => {
            next(err);
            res.redirect("index");
        })
    },

    locate: (req,res) => {
        res.render("location_editor");
    },

    location_edit: async (req,res) => {
        let id = req.query.id;
        let result = await Centre.findById(id);
        if(result){
            res.locals.apikey = GAT;
            res.locals.centre = result;
            res.render("location_edit");
        }
        else{
            res.redirect("/centre/locate");
        }
    },

    register: async (req, res) => {
        res.render("register");
    },

    location_update: async (req,res)=> {
        let id = req.query.id;
        let {address, location} = req.body;
        console.log(address);
        console.log(location);
        if(address){
            const {latlng, place_id} = await geocode(address);
            if(latlng && place_id){
                try{
                    let updated = await Centre.findByIdAndUpdate(id,{$set:{
                        latlng,
                        place_id,
                        address
                    }},{new:true});
                    res.redirect(`/centre/locate?id=${updated._id}`);
                } catch {err => {
                    console.error(err.message);
                    res.redirect("/");
                }} 
            }
        }
        else if(location){
            try{
                let {address, place_id} = await reverse_geocode(location);
                if(address){
                    location = location.split(",").map(v => parseFloat(v.trim()));
                    const latlng = {lat: location[0], lng: location[1]};
                    await Centre.findByIdAndUpdate(id, {$set:{
                        address,
                        latlng,
                        place_id
                    }}, {new:true});
                    res.redirect(`/centre/locate?id=${id}`);
                }
            }catch {err => {
                console.error(err.message);
                res.redirect("/");
            }}
        }
        else {
            res.redirect("/");
        }
    }
}
