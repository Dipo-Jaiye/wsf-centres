const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();
const {MONGO_URI} = process.env;

module.exports = {
    connectDB: () => {
        mongoose.connect(MONGO_URI,{
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(()=>{
            console.log("Database connection established");
        })
        .catch(err => {
            console.error(`Error connecting DB: ${err.message}`);
            process.exit(1);
        })
    }
}
