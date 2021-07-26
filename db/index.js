const mongoose = require("mongoose");
const {MONGO_URI} = require("../config/variables");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

mongoose.Promise = global.Promise;

const connectionOptions = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports = {
    connectDB: () => {
        mongoose.connect(MONGO_URI,connectionOptions)
        .then((res)=>{
            console.log("Database connection established");
        })
        .catch(err => {
            console.error(`Error connecting DB: ${err.message}`);
            process.exit(1);
        })
    },

    mongoSessionStore: () => {
        const store = new MongoDBStore({
            uri: MONGO_URI,
            collection: "sessions",
            connectionOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },function(error){
            if(error) console.error(error.message);
        });

        sessionOptions = {
                secret: "hz2d418dn(!*)@(d",
                cookie:{
                    maxAge: 400000
                },
                store: store,
                resave: false,
                saveUninitialized: false
            };
        
        return session(sessionOptions);
    }
}
