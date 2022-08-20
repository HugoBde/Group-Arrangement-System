// Third party import
import express  = require("express");
import bcryptjs = require("bcryptjs")

// Local import 
import db_client = require("./db-client");
import Student   = require("./student");

// Login route
async function login(req: express.Request, res: express.Response) {
    // Get the students collection
    const students_db = db_client.db("gas-db").collection<Student>("students");

    // Get the email and password provided by the user
    let {req_email, req_password} : {req_email: string, req_password: string} = req.body;

    // Look for student with same email address
    const student = await students_db.findOne<Student>(
        {"email_address": req_email}     // Search query
    );
    
    // If no match was found, return 401: Unauthorized
    // Do not specify whether the email address or the password was wrong 
    // as this provides useful information for someone trying to hack into a user's account
    if (student === null) {
        res.sendStatus(401);
        return;
    }

    // Compare the stored hash password with the password provided by the user
    const valid : boolean = await bcryptjs.compare(req_password, student.password);

    // If the password matches, user is logged in
    // Else return 401: Unauthosized
    // Do not specify whether the email address or the password was wrong 
    // as this provides useful information for someone trying to hack into a user's account
    if (valid) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
}

// Exported routes
export = {login}