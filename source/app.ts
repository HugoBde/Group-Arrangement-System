// Standard library imports
import path = require("path")


// Third party imports
import express = require("express");
import session = require("express-session");


// Local imports
import db     = require("./db-client");
import routes = require("./routes");


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

// Dashboard pages and similar
app.get("/dashboard", routes.dashboard_page);
app.get("/groups", routes.groups_page);                 // Group page
app.get("/group_members", routes.get_group_members);    // Fetch group members for AJAX
app.get("/class", routes.class_page);
app.get("/class_info", routes.get_class_info);
app.get("/help", routes.help_page);

// logout route
app.get('/logout', routes.logout);

// Preferences page
app.get("/preferences", routes.preferences_page);


//app.get("/not_grouped", routes.get_all_not_grouped);
//app.get("/get_interests", routes.get_interests);
app.get("/interests", routes.get_interests);
app.post("/insert_interest", routes.insert_interest);
app.post("/remove_interest", routes.remove_interest);

// Add preference route
app.post('/pref_form_submit', routes.pref_form_submit);

// Register route
app.get('/register', routes.register_page);

// Register form submission
app.post("/register", routes.register_form_submit);

// Group generation endpoints
app.get("/clear_groups", routes.clear_groups);
app.get("/make_groups_random/:target_group_size", routes.make_groups_random);
app.get("/make_groups_on_preference/:target_group_size", routes.make_groups_on_preference);

// Start server
const server = app.listen(port, () => {
    console.log(`Server started, listening on port ${port}...`);
});


// Gracefully shutdown server by disconnecting from database
// TODO: ensure all pending requests are handled before shutting down
function shutdown() {
    console.log("\nSIGTERM received, shutting down...");
    db.db_client.close();
    server.close(() => {
        console.log("=== Server closed ===");
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT" , shutdown);    //SIGINT can be sent by typing Ctrl+C from the terminal
