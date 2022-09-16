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
import Teacher   = require("./teacher");
import { assert } from "console";

import Class = require("./class");

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
    try {
        // Get the email and password provided by the user
        let req_email    = req.body.email_address;
        let req_password = req.body.password;

        let is_admin= false;

        let user : Student | Teacher | null ;

        // Do not touch this unless you know regex 
        if (req_email.match(/[A-Z][a-z]+\.[A-Z][a-z]+@student.uni.edu.au/)) {
            user = await db.students_collection.findOne<Student>(
                {"email_address": req_email}
            );
        } else if (req_email.match(/[A-Z][a-z]+\.[A-Z][a-z]+@uni.edu.au/)) {
            user = await db.teacher_collection.findOne<Teacher>(
                {"email_address": req_email}
            );
            is_admin = true;
        } else {
            res.redirect("/login");
            return;
        }
        
        // If no match was found, return 401: Unauthorized
        // Do not specify whether the email address or the password was wrong 
        // as this provides useful information for someone trying to hack into a user's account
        if (user === null) {
            res.redirect("/login");
            return;
        }

        // Compare the stored hash password with the password provided by the user
        const valid : boolean = await bcryptjs.compare(req_password, user.password);
            
        // If the password matches, user is logged in
        if (valid) {
            log.info(`Successful login attempt [USER: ${user.email_address}]`);
            req.session.regenerate(function() {
                // For some reason typescript believes user could be null at this point,
                // yet we should have returned if it was null
                // Stupid computer
                // Anyway, adding a '!' after user makes it stop whining 
                req.session.user     = user!; 
                req.session.is_admin = is_admin;
                res.redirect("/dashboard");
            });
        } else {
            log.warning(`Failed login attempt with incorrect password [USER: ${user.email_address}]`);
            res.redirect("/login");
        }
    } catch (err) {
        log.error(`Failed login due to internal error: ${err}`)
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
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
    
    // Otherwise, just display the right dashboard based on the user type
    if (req.session.is_admin) {
        res.sendFile(utils.get_views_path("dashboard-admin.html"));
    } else {
        res.sendFile(utils.get_views_path("dashboard.html"));
    }

}

// Get group members for a student
async function get_group_members(req: express.Request, res: express.Response) {
    try {

        // If the session does not hold a user object deny the request
        if (req.session.user === undefined) {
            res.sendStatus(403);
            return;
        }

        if (req.session.is_admin) {
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
    } catch (err) {
        log.error(`Failed fetching members due to internal error: ${err}`)
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}


// Get all student users that are not allocated a group
async function get_all_not_grouped(req: express.Request, res: express.Response){
    try {        
        // If the session does not hold a user object deny the request
        if (req.session.user === undefined) {
            res.sendStatus(403);
            return;
        }
        // Get the group id from the student
        //let group_id = req.session.user.group_id;

        // Get the group matching the -1 id from the database which means they are not grouped yet
        let group = await db.groups_collection.findOne({id: -1}); //change this to -1.

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
        
        console.log(output); //delete this line

        //always produces error because there is no students that do not have a group.
    } catch (err) {
        log.error(`Failed fetching members due to internal error: ${err}`)
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

//insert interest into the class document - interests array
async function insert_interest(req: express.Request, res: express.Response) {
    try {
        // If the session does not hold a user object deny the request
        if (req.session.user === undefined) {
            res.sendStatus(403);
            return;
        }

        let class_of_students_not_the_keyword_class_leave_me_alone_javascript = await db.class_collection.findOne({name: "Test class 2"}); //test class 2 cause this document has an interests list

        //error check
        if (class_of_students_not_the_keyword_class_leave_me_alone_javascript === null) {
            log.error("class not found");
            return;
        }

        var documentCount = await db.class_collection.countDocuments({interests: req.body.interest_name});

        //checks if the interest already exists
        if( documentCount == 0 ){
            //Mongodb's Insert function
            let result = await db.class_collection.updateOne({_id: class_of_students_not_the_keyword_class_leave_me_alone_javascript._id},
                                                                { $push: {interests: req.body.interest_name}});

            if (result) {
                log.info(`Interest successfully added [Interest: ${req.body.interest_name}]`);
                res.redirect("/preference");
            } else {
                log.error("Failed to add interest");
                res.redirect("/preference");
            }
        }

    } catch (err) {
        log.error(`Failed to add interest due to internal error: ${err}`)
        if (res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

//getting all the available interests/topics that a student can opt themselves into.
async function get_interests(req: express.Request, res: express.Response) {
    try {        
        // If the session does not hold a user object deny the request
        if (req.session.user === undefined) {
            res.sendStatus(403);
            return;
        }

        let classStudent = await db.class_collection.findOne({name: "Test class 2"}); //test class 2 cause this document has an interests list

        //error check
        if (classStudent === null) {
            log.error("class not found");
            return;
        }

        //let interests1 = await db.class_collection.find({interests: {}});
        //let intersts1 = await db.class_collection.find({classStudent:{interests: []}});
        //let interests1 = db.class_collection.find();

        let output = classStudent.interests;

        res.set("Content-Type", "application/json");
        
        // Sends the list as Json
        res.json(output);


    } catch (err) {
        log.error(`Failed fetching members due to internal error: ${err}`)
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

// Logout
function logout(req: express.Request, res: express.Response) {
    req.session.destroy(function () {})
    res.redirect("/");
}

// Register page
function register_page(req: express.Request, res: express.Response){
    if (req.session.user !== undefined) {
        res.redirect("/dashboard");
        return;
    }

    // Otherwise, just display the dashboard
    res.sendFile(utils.get_views_path("register.html"));
}

// Register route
async function register_form_submit(req: express.Request, res: express.Response) {
    try {

        // Get the students collection
        
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
    } catch (err) {
        log.error(`Failed registering due to internal error: ${err}`)
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

// Exported routes
export = {
    dashboard_page,
    home_page,
    login_page,
    login_form_submit,
    register_page,
    register_form_submit,
    get_group_members,
    get_all_not_grouped,
    insert_interest,
    get_interests,
    logout,
};