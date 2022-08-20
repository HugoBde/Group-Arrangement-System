// Third party import
import express = require("express");

// Local import 
import db_client = require("./db-client");

// Login route
function login(req: express.Request, res: express.Response) {
    console.log(req.body);
    res.sendStatus(200);
}

// Exported routes
export = {login}