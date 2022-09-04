// Standard library import
import path = require("path");


// Third party import
import express  = require("express");
import bcryptjs = require("bcryptjs")


// Local import 
import db        = require("./db-client");
import log       = require("./log");
import Student   = require("./student");
import utils     = require("./utils");


// Home page
function home_page(req: express.Request, res: express.Response) {
    res.sendFile(utils.get_views_path("index.html"));
}


// Login page
function login_page(req: express.Request, res: express.Response) {
    // If a user is attached to this session, redirect to dashboard
    if (req.session.user !== undefined) {
        res.redirect("/dashboard");
        return;
    }

    // Otherwise, proceed to login page
    // First disaable caching of the page
    // This forces the browser to re run the GET /login
    // Meaning a logged in user can't access this page
    // By going to the prev page after logging in
    res.set("Cache-Control", "no-store");
    res.sendFile(utils.get_views_path("login.html"));
}


// Login form submission route
async function login_form_submit(req: express.Request, res: express.Response) {

    // Get the email and password provided by the user
    let req_email    = req.body.email_address;
    let req_password = req.body.password;

    // Look for student with same email address
    const student = await db.students_collection.findOne<Student>(
        {"email_address": req_email}     // Search query
    );
    
    
    // If no match was found, return 401: Unauthorized
    // Do not specify whether the email address or the password was wrong 
    // as this provides useful information for someone trying to hack into a user's account
    if (student === null) {
        res.redirect("/login");
        return;
    }


    // Compare the stored hash password with the password provided by the user
    const valid : boolean = await bcryptjs.compare(req_password, student.password);

    // If the password matches, user is logged in
    if (valid) {
        log.info(`Successful login attempt [USER: ${student.email_address}]`);
        req.session.regenerate(function() {
            req.session.user = student;
            res.redirect("/dashboard");
        });
    } else {
        log.warning(`Failed login attempt with incorrect password [USER: ${student.email_address}]`);
        res.redirect("/login");
    }
}


// Get dashboard page
function dashboard_page(req: express.Request, res: express.Response) {
    // If no user object is attached to the session, it means 
    // the user is not logged in, so redirect them to the login page
    if (req.session.user === undefined) {
        res.redirect("/login");
        return;
    }

    // Otherwise, just display the dashboard
    res.sendFile(utils.get_views_path("dashboard.html"));
}

// Get group members for a student
async function get_group_members(req: express.Request, res: express.Response) {
    // If the session does not hold a user object deny the request
    if (req.session.user === undefined) {
        res.sendStatus(403);
        return;
    }

    // Get the group id from the student
    let group_id = req.session.user.group_id;

    // Get the group matching the id from the database
    let group = await db.groups_collection.findOne({id: group_id});

    // Mandatory error checking
    if (group == null) {
        res.sendStatus(500);
        return;
    }

    // Find all students whose id is in the array of id of the group
    let students = await db.students_collection.find({id: {$in: group.students}}).toArray();

    // Create a string array that will contain the name of the students in the group
    let output : string[] = [];

    // For each student returned by the previous query, add their name to the list
    for(let student of students) {
        output.push(`${student.first_name} ${student.last_name}`);
    }

    // Set the Content-Type header so that the web browser doesnt throw a hissy fit
    res.set("Content-Type", "application/json");

    // Send the ouput list as json
    res.json(output);
}

// Get all student users
async function get_all_users(req: express.Request, res: express.Response){
    
    // If the session does not hold a user object deny the request
    if (req.session.user === undefined) {
        res.sendStatus(403);
        return;
    }

    // Get the group id from the student
    let group_id = req.session.user.group_id;

    // Get the group matching the id from the database
    let group = await db.groups_collection.findOne({id: group_id});

    // Mandatory error checking
    if (group == null) {
        res.sendStatus(500);
        return;
    }

}

// Register route
async function register_form_submit(req: express.Request, res: express.Response) {
    
    // Get the students collection
    console.log("registering user...");
    
    let hash = await bcryptjs.hash(req.body.password, 10);

    let student = new Student(req.body.id_num, req.body.first_name, req.body.last_name, req.body.email, hash);

    var documentCount = await db.students_collection.countDocuments({email: req.body.email}, {limit: 1})
      
    //checks if the email already exists
    if( documentCount == 0 ){
        //Mongodb's Insert function
        let result = await db.students_collection.insertOne(student);
        
        if (result) {
            log.info(`User successfully added [USER: ${student.email_address}]`);
            res.redirect("/login");
        } else {
            log.error("Failed to create user");
            res.redirect("/register");
        }
    }
}

// Exported routes
export = {
    dashboard_page,
    home_page,
    login_page,
    login_form_submit,
    register_form_submit,
    get_group_members
};