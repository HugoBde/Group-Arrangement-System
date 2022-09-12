// Third Party imports
import mongodb = require("mongodb");

// Local imports
import db      = require("./db-client");
import log     = require("./log");
import Student = require("./student");
import Class   = require("./class");

const maxvalue : number = 5;

class Group {
    // We only refer to students via their id number
    id:       number;
    students: number[];

    constructor(id: number) {
        this.id       = id
        this.students = [];
    }

}

export = Group;
