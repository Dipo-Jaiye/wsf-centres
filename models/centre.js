const {Schema, model} = require("mongoose");

const centreSchema = new Schema({
    name: String,
    address: String,
    contact: [String],
    phone: [String],
    latlng: {
        lat: Number,
        lng: Number
    },
    place_id: String
});

module.exports = model("Centre",centreSchema);