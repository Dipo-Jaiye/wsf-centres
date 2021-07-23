const express = require("express");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
require("dotenv").config();
const {PORT, port} = process.env;
const routes = require("./routes");
const appPort = PORT || port
const { connectDB } = require("./db");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

connectDB();

app = express();

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

app.use("/", routes);

app.listen(appPort, () => console.log(`App listening on port ${appPort}. http://localhost:${appPort}/`));
