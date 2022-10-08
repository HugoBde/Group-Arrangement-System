// Third Party imports
import mongodb = require("mongodb");

// Local imports
import db      = require("./db-client");
import log     = require("./log");
import Student = require("./student");
import Class   = require("./class");
import { assert } from "console";

const maxvalue : number = 5;

class Group {
    // We only refer to students via their id number
    id:       number;
    student_ids: number[];

    static make_groups_random(students: Student[], target_group_size: number = 5) : Group[] {
        
        let target_group_number = Math.round(students.length / target_group_size);

        let groups = [];

        for(let i = 0; i < target_group_number; i++) {
            groups.push(new Group(i));
        }

        for(let [i, student] of students.entries()) {
            groups[i % target_group_number].student_ids.push(student.id);
            student.group_id = i % target_group_number;
        }
        
        return groups;
    }
    constructor(id: number) {
        this.id          = id
        this.student_ids = [];
    }

}


export = Group;
