// Third party imports
import express = require("express");

// Local imports
import db_client = require("./db-client");
import routes    = require("./routes");

// constants
const port = 8080;

// Create express app
const app  = express();

// Enable POST requests parsers
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Login route
app.post("/post", routes.login);

// Dummy main page route
app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

// Register route
app.get('/register', (req, res) => {
    console.log("register get");
    res.send('GET request to the register page')
  })

app.post("/register", routes.register);


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