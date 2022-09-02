// Standard library imports
import path = require("path")


// Third party imports
import express = require("express");
import session = require("express-session");


// Local imports
import db_client = require("./db-client");
import routes    = require("./routes");
import { CompleterResult } from "readline";


// constants
const port = 8080;


// Create express app
const app = express();


// Enable server-side sessions
app.use(session({
    // Ideally the secret would be stored in an environment variable
    // so that it does not show in the repository
    // But I cannot be bothered to set that up for the moment
    secret: "IDespiseJavascript",

    resave: false,
    saveUninitialized: false
}))


// Enable POST requests parsers
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// Enable static file serving
app.use("/stylesheets", express.static("public/stylesheets"));
app.use("/scripts",     express.static("public/scripts"));
app.use("/icons",       express.static("public/icons"));
app.use("/assets",      express.static("public/assets"));


// ROUTES

// Home page
app.get("/", routes.home_page);

// Login page
app.get("/login", routes.login_page);
app.post("/login", routes.login_form_submit);

// Dashboard page
app.get("/dashboard", routes.dashboard_page);

// logout route
app.get('/logout', routes.logout);

// Register route
app.get('/register', (req, res) => {
    console.log("register get");
    res.sendFile(path.join(__dirname, "../public/views/register.html"));
});

app.post("/register", routes.register_form_submit);


// Start server
const server = app.listen(port, () => {
    console.log(`Server started, listening on port ${port}...`);
});


// Gracefully shutdown server by disconnecting from database
// TODO: ensure all pending requests are handled before shutting down
function shutdown() {
    console.log("\nSIGTERM received, shutting down...");
    db_client.close();
    server.close(() => {
        console.log("=== Server closed ===");
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT" , shutdown);    //SIGINT can be sent by typing Ctrl+C from the terminal