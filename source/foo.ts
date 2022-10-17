import db        = require("./db-client");

async function fk() {
    db.students_collection.updateMany({}, {$set:{}})
}

//fk();



//used to update database