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
    students: number[];

    constructor(id: number) {
        this.id       = id
        this.students = [];
    }

}

async function make_groups(target_group_size: number) {
    
    let class_of_students_not_the_keyword_class_leave_me_alone_javascript = await db.class_collection.findOne({});

    if (class_of_students_not_the_keyword_class_leave_me_alone_javascript === null) {
        log.error("class not found");
        return;
    }

    let students = await db.students_collection.find({_id:{$in: class_of_students_not_the_keyword_class_leave_me_alone_javascript.students}}).toArray();

    let target_group_number = Math.round(students.length / target_group_size);

    let groups = [];

    for(let i = 0; i < target_group_number; i++) {
        groups.push(new Group(i));
    }

    for(let i = 0; i < students.length; i++) {
        groups[i % target_group_number].students.push(students[i].id);
    }

    let result = await db.groups_collection.insertMany(groups);

    if (result.acknowledged) {
        log.info(`Groups successfully created for class ${class_of_students_not_the_keyword_class_leave_me_alone_javascript.name}`);
        assert(result.insertedCount === target_group_number);
        for(let group of groups) {
            for(let student_id of group.students) {
                await db.students_collection.updateOne({id: student_id}, {$set: {group_id: group.id}});
            }
        }
    } else {
        log.error(`Failed to add groups for class ${class_of_students_not_the_keyword_class_leave_me_alone_javascript.name}`);
    }

    db.db_client.close();
}

export = Group;
