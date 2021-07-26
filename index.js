const express = require("express");
const layouts = require("express-ejs-layouts");
const {PORT, port} = require("./config/variables");
const routes = require("./routes");
const appPort = PORT || port;
const { connectDB } = require("./db");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Connect to the MongoDB database
connectDB();

// Initialize the Express application
app = express();

// Load all required middleware
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(layouts);

// Route all requests to the routes
app.use("/", routes);

// Start the app listening on the specified port
app.listen(appPort, () => console.log(`App listening on port ${appPort}. http://localhost:${appPort}/`));
