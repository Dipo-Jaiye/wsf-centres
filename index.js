const express = require("express");
const layouts = require("express-ejs-layouts");
const {PORT, port} = require("./config/variables");
const routes = require("./routes");
const appPort = PORT || port;
const { connectDB, mongoSessionStore} = require("./db");
const passport = require('passport');
const User = require('./models/user');

// Connect to the MongoDB database
connectDB();

// Initialize the Express application
app = express();

// Load all required middleware
// Serve static assets
app.use(express.static("public"));

// Initialize session
app.use(mongoSessionStore());

// Enable Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Set EJS for templating
app.set("view engine", "ejs");
app.use(layouts);

// Route all requests to the routes
app.use("/", routes);

// Start the app listening on the specified port
app.listen(appPort, () => console.log(`App listening on port ${appPort}. http://localhost:${appPort}/`));
