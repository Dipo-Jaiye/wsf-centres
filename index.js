const express = require("express");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
require("dotenv").config();
const {PORT, port} = process.env;
const routes = require("./routes");
const appPort = PORT || port;
const {connectDB} = require("./db");

connectDB();

app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(layouts);

app.use("/", routes);

app.listen(appPort, () => console.log(`App listening on port ${appPort}. http://localhost:${appPort}/`));