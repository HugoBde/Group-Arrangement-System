// Third party import
import express  = require("express");
import bcryptjs = require("bcryptjs")

// Local import 
import db_client = require("./db-client");
import Student   = require("./student");
//import { MongoAPIError, MongoClient } from "mongodb";
//import { assert } from "console";

//My Vars
var assert = require('assert');
var url = "mongodb+srv://gas-admin:tXJg2afFSC5GkauF@gas-cluster.smm5ykq.mongodb.net/?retryWrites=true&w=majority";

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const databaseName = 'gas-db';



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

var regErrMsg = false;

// Register route
async function register(req: express.Request, res: express.Response) {
    
    // Get the students collection
    //const students_db = db_client.db("gas-db").collection<Student>("students");
    console.log("register func");
    
    bcryptjs.hash(req.body.password, 10, function(err, hash) {
        var items = {
            id_num: req.body.id_num,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash
        }
        //conneting to the database
        MongoClient.connect(url, function(err:any, client:any){
            assert.equal(null, err); //Used to compare data and throw exceptions
      
            const db = client.db(databaseName);
            var documentCount;
            var limit = 1;

            //console.log("Database created!");
            console.log(items);
      
            db.collection("students").countDocuments({email: req.body.email}, limit)
                .then(function(items:any) {
                  console.log(items); // comment this out
                  documentCount = items;
      
                  //checks if the email already exists
                  if( documentCount == 0 ){
                    //Mongodb's Insert function
                    db.collection('students').insertOne(items, function(err:any, result:any){
                      assert.equal(null, err);
                      
                      client.close(); //close database

                      console.log("User added to database!");
      
                      res.redirect('/login');
      
                    });
                  }
                  else{
                    console.log("there was an error!");
                    regErrMsg = true;
                    res.redirect('/register');
                  }
      
                })
       
          });
      
        });

}


/*Database Functions*/
/*express.Router.get("get-users", function(req, res, next) {
    var returnArray = [];
    MongoClient.connect(url, function(err:any, client:any){
        assert.equal(null, err); //Used to compare data and throw exceptions
  
        const db = client.db(databaseName);
        var cursor = db.collection('User').find();

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            returnArray.push(doc); //storing to local array
          }, function(){
            client.close(); //closing database
            res.json(returnArray);
          });
    });
});*/


// Exported routes
export = {login, register}

