// Standard library import
import path = require("path");


// Third party import
import express  = require("express");
import bcryptjs = require("bcryptjs")


// Local import 
import db_client = require("./db-client");
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
    // Get the students collection
    const students_db = db_client.db("gas-db").collection<Student>("students");

    // Get the email and password provided by the user
    let req_email    = req.body.email_address;
    let req_password = req.body.password;

    // Look for student with same email address
    const student = await students_db.findOne<Student>(
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
        req.session.regenerate(function() {
            req.session.user = student;
            res.redirect("/dashboard");
        });
    } else {
        res.redirect("/login");
    }
}


// Get dashboard page
function dashboard_page(req: express.Request, res: express.Response) {
    console.log(req.session);
    // If no user object is attached to the session, it means 
    // the user is not logged in, so redirect them to the login page
    if (req.session.user === undefined) {
        res.redirect("/login");
        return;
    }

    // Otherwise, just display the dashboard
    res.sendFile(utils.get_views_path("dashboard.html"));
}


// Register route
async function register_form_submit(req: express.Request, res: express.Response) {
    
    // Get the students collection
    //console.log("register func");
    
    let hash = await bcryptjs.hash(req.body.password, 10);

    let student = new Student(req.body.id_num, req.body.first_name, req.body.last_name, req.body.email, hash);

    //conneting to the database
    const db = db_client.db("gas-db");
    var limit = 1;

    //console.log("Database created!");
    console.log(student);
      
    var documentCount = await db.collection("students").countDocuments({email: req.body.email}, {limit: 1})
      
    //checks if the email already exists
    if( documentCount == 0 ){
        //Mongodb's Insert function
        let result = await db.collection('students').insertOne(student);
        
        if (result) {
            console.log("User added to the database!");
            res.redirect("/login");
        } else {
            console.log("error");
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
}