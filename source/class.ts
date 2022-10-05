// Third Party imports
import mongodb = require("mongodb");

// Local imports
import db      = require("./db-client");
import log     = require("./log");
import Student = require("./student");
//import Class = require("./class");
import { assert } from "console";

class Class {
    id          : number;
    name        : string;
    subject     : string;
    students    : mongodb.ObjectId[];
    interests   : string[]; //array of subjects of available
    groups_made : boolean;

    constructor(name: string, subject: string) {
        this.id          = -1;
        this.name        = name;
        this.subject     = subject;
        this.students    = [];
        this.interests   = []; //stores the list of interests/topics available to the students
        this.groups_made = false;
    }
}

// //insert a class (subject) into class collection
// async function insert_class(name:string, subject1:string) {
//     console.log("creating a new class...");
// 
//     let subject = new Class(name, subject1);
//     
//     var documentCount = await db.groups_collection.countDocuments({name}, {limit: 1})
// 
//     //check if class already exists
//     if(documentCount == 0){
//         let result = await db.class_collection.insertOne(subject);
//         
//         if (result) {
//             log.info(`Class successfully added [CLASS: ${subject.name}]`);
//         } else {
//             log.error("Failed to add class");
//         }
//     }
// }



export = Class;

