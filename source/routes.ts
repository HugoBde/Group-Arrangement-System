// Standard library import
import path = require("path");


// Third party import
import express  = require("express");
import bcryptjs = require("bcryptjs")


// Local import 
import Class   = require("./class");
import db      = require("./db-client");
import Group   = require("./group");
import log     = require("./log");
import Student = require("./student");
import utils   = require("./utils");
import Teacher = require("./teacher");
import { assert } from "console";
import student = require("./student");


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

function groups_page(req: express.Request, res: express.Response) {
    // If no user object is attached to the session, it means 
    // the user is not logged in, so redirect them to the login page
    if (req.session.user === undefined) {
        res.redirect("/login");
        return;
    }

    // THis page is not for admins
    if (req.session.is_admin) {
        res.redirect("/dashboard");
        return;
    }

    res.sendFile(utils.get_views_path("groups.html"));
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
        // @ts-ignore
        let group_id = req.session.user.group_id;
        
        // Get the group matching the id from the database
        let group = await db.groups_collection.findOne({id: group_id});
        
        // Set the Content-Type header so that the web browser doesnt throw a hissy fit
        res.set("Content-Type", "application/json");

        // Mandatory error checking
        // Send an empty array if they have no group
        if (group == null) {
            res.json([]);
            return;
        }
        
        // Find all students whose id is in the array of id of the group
        let students = await db.students_collection.find({id: {$in: group.student_ids}}).toArray();
        
        // Create a string array that will contain the name of the students in the group
        let output : string[] = [];
        
        // For each student returned by the previous query, add their name to the list
        for(let student of students) {
            output.push(`${student.first_name} ${student.last_name}`);
        }
        
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
        let students = await db.students_collection.find({id: {$in: group.student_ids}}).toArray();
        
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
        
        // Ensure the user is allowed to make such request
        if (req.session.user === undefined || req.session.is_admin == false) {
            res.sendStatus(403);
            return;
        }

        // If the teacher does not have a class associated with them, reject the request
        if (req.session.user.class_id == -1) {
            res.sendStatus(404);
            return;
        }

        let userClassID = req.session.user.class_id;

        let class_of_students_not_the_keyword_class_leave_me_alone_javascript = await db.class_collection.findOne({id: userClassID});

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

//remove interest from the class document - interests array
async function remove_interest(req: express.Request, res: express.Response) {
    try {
        // Ensure the user is allowed to make such request
        if (req.session.user === undefined || req.session.is_admin == false) {
            res.sendStatus(403);
            return;
        }

        // If the teacher does not have a class associated with them, reject the request
        if (req.session.user.class_id == -1) {
            res.sendStatus(404);
            return;
        }

        let userClassID = req.session.user.class_id;

        let class_of_students_not_the_keyword_class_leave_me_alone_javascript = await db.class_collection.findOne({id: userClassID});

        //error check
        if (class_of_students_not_the_keyword_class_leave_me_alone_javascript === null) {
            log.error("class not found");
            return;
        }

        var documentCount = await db.class_collection.countDocuments({interests: req.body.interest_name});

        //checks if the interest exists
        if( documentCount == 1 ){

            //Mongodb's remove function
            let result = await db.class_collection.updateOne({_id: class_of_students_not_the_keyword_class_leave_me_alone_javascript._id},
                                                                { $pull: {interests: req.body.interest_name}});

            if (result) {
                log.info(`Interest successfully removed [Interest: ${req.body.interest_name}]`);
                res.redirect("/preference");
            } else {
                log.error("Failed to remove interest");
                res.redirect("/preference");
            }
        }

    } catch (err) {
        log.error(`Failed to remove interest due to internal error: ${err}`)
        if (res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

//getting all the available interests/topics that a student can opt themselves into.
async function get_interests(req: express.Request, res: express.Response) {
    try {        
        // Ensure the user is allowed to make such request
        if (req.session.user === undefined || req.session.is_admin == false) {
            res.sendStatus(403);
            return;
        }

        // If the teacher does not have a class associated with them, reject the request
        if (req.session.user.class_id == -1) {
            res.sendStatus(404);
            return;
        }

        let userClassID = req.session.user.class_id;

        let classStudent = await db.class_collection.findOne({id: userClassID}); 

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

// Add student preferences to student
async function pref_form_submit(req: express.Request, res: express.Response) {
    try {
        //console.log(req.body);
        
        // If the session does not hold a user object deny the request
        if (req.session.user === undefined) {
            res.sendStatus(403);
            return;
        }

        if (req.session.is_admin) {
            res.sendStatus(403);
            return;
        }

        let student_id = req.session.user.id;

        await db.students_collection.findOne();

        var documentCount = await db.students_collection.countDocuments({"id":student_id});
        
        //checks the student exists
        if( documentCount == 1 ){
            //updating the student document using mongo's updateOne()
            let result = await db.students_collection.updateOne({"id": student_id}, [{ $set: {"degree": req.body.degree, "year": req.body.year, "interest": req.body.interest} }] );

            if (result) {
                log.info(`User successfully added to User preferences [Degree: ${req.body.degree}] [Year: ${req.body.year}] [Interest: ${req.body.interest}]`);
                res.redirect("/preference");
            } else {
                log.error("Failed to update user preferences");
                res.redirect("/preference");
            }   
        }
    
    } catch (err) {
        log.error(`Failed registering due to internal error: ${err}`)
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

// Filter by Prefernces
function filterByDegree(req: express.Request, res: express.Response){
    const filter = {"degree": req.body.degree};
    db.students_collection.find(filter);
}
function filterByYear(req: express.Request, res: express.Response){
    const filter = {"year": req.body.year};
    db.students_collection.find(filter);
}
function filterbyInterest(req: express.Request, res: express.Response){
    const filter = {"interest": req.body.interest};
    db.students_collection.find(filter);
}



// Sort by Preferences
function sortByPreferences(req: express.Request, res: express.Response){
    var i;
    function sortByDegree(){
        filterByDegree;
        const sort = {"degree": req.body.degree};
        for (i = 0; i < req.body.degree.size; i++){
            
        }
    }
    function sortByYear(){
        filterByYear;
        const sort = {"year": req.body.year};
        for (i = 0; i < req.body.year.size; i++){
           
        }
    }
    function sortByInterest(){
        filterbyInterest
        const sort = {"interest": req.body.interest};
        for (i = 0; i < req.body.interest.size; i++){

        }
    }

}

// Assign by Preferences
function assignByPreferences(req: express.Request, res: express.Response){

    let students = get_all_not_grouped;
    
    function assignByDegree(){

        function assignByYear(){

            function assignByInterest(){

            }
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
        
        let student = new Student(req.body.id_num, req.body.first_name, req.body.last_name, req.body.email, hash, req.body.interest);
        
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

function preferences_page(req: express.Request, res: express.Response) {
    // If no user object is attached to the session, it means 
    // the user is not logged in, so redirect them to the login page
    if (req.session.user === undefined) {
        res.redirect("/login");
        return;
    }
    
    // Otherwise, just display the right dashboard based on the user type
    if (req.session.is_admin) {
        res.sendFile(utils.get_views_path("preferences-admin.html"));
    } else {
        res.sendFile(utils.get_views_path("preferences-student.html"));
    }
}

function class_page(req: express.Request, res: express.Response) {
    // If no user object is attached to the session, it means 
    // the user is not logged in, so redirect them to the login page
    if (req.session.user === undefined) {
        res.redirect("/login");
        return;
    }
    
    // Otherwise, just display the right dashboard based on the user type
    if (req.session.is_admin) {
        res.sendFile(utils.get_views_path("class.html"));
    } else {
        res.redirect("/dashboard");
    }
}

async function get_class_info(req: express.Request, res: express.Response) {
    try {
        if (req.session.user === undefined || req.session.is_admin == false) {
           res.sendStatus(403);
           return;
        }
        
        // If the teacher does not have a class associated with them, reject the request
        if (req.session.user.class_id == -1) {
            res.sendStatus(404);
            return;
        }
        
        let student_info : any[] = [];
        await db.students_collection.find<Student>({class_id: req.session.user.class_id}).forEach(student => {
            student_info.push({
                first_name : student.first_name,
                last_name  : student.last_name,
                group_id   : student.group_id,
            })
        });
        res.json(student_info);
    } catch (err) {
        log.error(`Failed login due to internal error: ${err}`)
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
    
}

async function clear_groups(req: express.Request, res: express.Response) {
    try {
        // Ensure the user is allowed to make such request
        if (req.session.user === undefined || req.session.is_admin == false) {
            res.sendStatus(403);
            return;
        }
       
        // If the teacher does not have a class associated with them, reject the request
        if (req.session.user.class_id == -1) {
            res.sendStatus(404);
            return;
        }
        
        // DElete groups for the teacher's class
        await db.groups_collection.deleteMany({class_id: req.session.user.class_id});
        
        // Delete group id from students
        await db.students_collection.updateMany({class_id: req.session.user.class_id}, {$set: {group_id: -1}});

        // Fetch updated students to send it to the front end so that the table can be updated 
        let student_info : any[] = [];
        await db.students_collection.find<Student>({class_id: req.session.user.class_id}).forEach(student => {
            student_info.push({
                first_name : student.first_name,
                last_name  : student.last_name,
                group_id   : student.group_id,
            })
        });
        res.json(student_info);
    } catch (err) {
        log.error(`Failed to clear groups due to internal error: ${err}`);
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}


// Generate groups randomly
async function make_groups_random(req: express.Request, res: express.Response) {
    try {
        // Ensure the user is allowed to make such request
        if (req.session.user === undefined || req.session.is_admin == false) {
            res.sendStatus(403);
            return;
        }

        // If the teacher does not have a class associated with them, reject the request
        if (req.session.user.class_id == -1) {
            res.sendStatus(404);
            return;
        }
       
        // Fetch students from the teachers class
        let students : Student[] = [];
        await db.students_collection.find<Student>({class_id: req.session.user.class_id}).forEach(student => {
            students.push(student);
        });

        // Put students in random groups
        let groups = Group.make_groups_random(req.session.user.class_id, students);

        // Let's do all database requests asynchronously 
        // (i.e.: don't wait for the first one to complete to send the second one)
        // Then use Promise.all([promises]) to wait for all of them to complete before
        // sending our reponse
        let database_rqs = [];

        // Update the groups database
        database_rqs.push(db.groups_collection.insertMany(groups));

        // Update students' group id
        for(let group of groups) {
            database_rqs.push(db.students_collection.updateMany({id: {$in: group.student_ids}}, {$set: {group_id: group.id}}));
        }
        
        // Here we wait for all the promises to complete
        await Promise.all(database_rqs);

        let student_info = [];

        for(let student of students) {
            student_info.push({
                first_name: student.first_name,
                last_name : student.last_name,
                group_id  : student.group_id,
            })
        }

        res.json(student_info);
    } catch (err) {
        log.error(`Failed to generate groups due to internal error: ${err}`);
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

async function make_groups_on_preference(req: express.Request, res: express.Response) {
    try {
        // Ensure the user is allowed to make such request
        if (req.session.user === undefined || req.session.is_admin == false) {
            res.sendStatus(403);
            return;
        }

        // If the teacher does not have a class associated with them, reject the request
        if (req.session.user.class_id == -1) {
            res.sendStatus(404);
            return;
        }

        let class_id = req.session.user.class_id;

        // Fetch students from the teachers class
        let students : Student[] = [];
        await db.students_collection.find<Student>({class_id: class_id}).forEach(student => {
            students.push(student);
        });

        // Let's make a copy of the students array since the first one is consummed 
        let students_copy = [...students];

        let groups = Group.make_groups_on_preference(class_id, students);

        let groups_info = [];

        for (let group of groups) {
            let group_info = [];
            for (let student of students_copy) {
                if (group.student_ids.includes(student.id)) {
                    group_info.push({
                        first_name : student.first_name,
                        last_name  : student.last_name,
                        interest   : student.interest,
                        id         : student.id
                    });
                }
            }
            groups_info.push(group_info);
        }

        res.json(groups_info)
    } catch (err) {
        log.error(`Failed to generate groups due to internal error: ${err}`);
        if (!res.writableEnded) {
            res.sendStatus(500);
        }
    }
}

function help_page(req: express.Request, res: express.Response) {
    // If no user object is attached to the session, it means
    // the user is not logged in, so redirect them to the login page
    if (req.session.user === undefined) {
        res.redirect("/login");
        return;
    }

    // This page is not for admins
    if (req.session.is_admin) {
        res.redirect("/dashboard");
        return;
    }

    res.sendFile(utils.get_views_path("help.html"));
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
    remove_interest,
    get_interests,
    pref_form_submit,
    logout,
    groups_page,
    preferences_page,
    class_page,
    get_class_info,
    clear_groups,
    make_groups_random,
    make_groups_on_preference,
    help_page
};
