// Third Party import
import mongodb = require("mongodb");

// Local import
import Class   = require("./class");
import Group   = require("./group");
import Student = require("./student");
import Teacher = require("./teacher");

// Create a client to connect to database
// NOTE: the URI is hard coded but this isn't best practice
//       since if we were to make the repository public, the 
//       username and passwords would be exposed. An alternative
//       would be to save the URI as an environment variable
//       which can be stored in a file that is not tracked by Git
const db_client           : mongodb.MongoClient         = new mongodb.MongoClient("mongodb+srv://gas-admin:tXJg2afFSC5GkauF@gas-cluster.smm5ykq.mongodb.net/?retryWrites=true&w=majority");

const gas_db              : mongodb.Db                  = db_client.db("gas-db");
const class_collection    : mongodb.Collection<Class>   = gas_db.collection("classes");
const groups_collection   : mongodb.Collection<Group>   = gas_db.collection("groups");
const students_collection : mongodb.Collection<Student> = gas_db.collection("students");
const teacher_collection  : mongodb.Collection<Teacher> = gas_db.collection("teachers");

// Export client and collections for use by our app
export = {
    db_client,
    class_collection,
    groups_collection,
    students_collection,
    teacher_collection
};
