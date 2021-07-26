const mongoose = require("mongoose");
const {MONGO_URI} = require("../config/variables");
mongoose.Promise = global.Promise;

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
