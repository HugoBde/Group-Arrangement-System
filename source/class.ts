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

export = Class;