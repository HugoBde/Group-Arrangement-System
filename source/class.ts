import mongodb = require("mongodb");

class Class {
    name:    string;
    subject: string;
    students: mongodb.ObjectId[];

    constructor(name: string, subject: string) {
        this.name       = name;
        this.subject    = subject;
        this.students   = [];
    }
}

async function insert_class(req: express.Request, res: express.Response) {
    console.log("creating a new class...");

    let class = new Class(req.body.name, req.body.subject, req.body.students);
    
    var documentCount = await db.groups_collection.countDocuments({name: req.body.subject}, {limit: 1})

    //check if class already exists
    if(documentCount == 0){
        let result = await db.class_collection.insertOne(class);
        

        if (result) {
            log.info(`Class successfully added [USER: ${class.subject}]`);
            res.redirect("/dashboard");
        } else {
            log.error("Failed to add class");
            res.redirect("/register");
        }
    }
}

export = Class;