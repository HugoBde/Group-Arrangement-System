// Third Party imports
import mongodb = require("mongodb");

// Local imports
import db      = require("./db-client");
import log     = require("./log");
import Student = require("./student");
import Class   = require("./class");
import { assert } from "console";
import { fileURLToPath } from "url";

const maxvalue : number = 5;

class Group {

    // We only refer to students via their id number
    class_id        : number;
    id              : number;
    student_ids     : number[];
    common_interest : string;

    static make_groups_random(class_id: number, students: Student[], target_group_size: number = 5) : Group[] {
        
        let target_group_number = Math.round(students.length / target_group_size);

        let groups = [];

        for(let i = 0; i < target_group_number; i++) {
            groups.push(new Group(class_id, i));
        }

        for(let [i, student] of students.entries()) {
            groups[i % target_group_number].student_ids.push(student.id);
            student.group_id = i % target_group_number;
        }
        
        return groups;
    }

    static make_groups_on_preference(class_id: number, students: Student[], target_group_size: number = 5) : Group[] {
        let groups : Group[] = [];
        let could_not_be_grouped = [];

        let target_group_number = Math.round(students.length / target_group_size);

        // First pass: Take a student, and match him with people
        // with similar interest until the group is full
        while (students.length > 0) {
            let group = new Group(class_id, groups.length);

            group.student_ids.push(students[0].id);
            group.common_interest = students[0].interest;

            // Look in the remainder of the array for students iwth similar interests
            for(let i = 1; i < students.length && group.student_ids.length < target_group_size; i++) {
                if (students[i].interest === group.common_interest) {
                    group.student_ids.push(students[i].id);
                }
            }

            // If the group formed is big enough, remove the students from the list
            // and save that group 
            if (group.student_ids.length / target_group_size >= 0.66) {
                for (let i = 0; i < students.length; ) {
                    if (group.student_ids.includes(students[i].id)) {
                        students.splice(i, 1);
                    } else {
                        i++
                    }
                }
                groups.push(group);
            } else {
                for (let i = 0; i < students.length; ) {
                    if (group.student_ids.includes(students[i].id)) {
                        could_not_be_grouped.push(students[i]);
                        students.splice(i, 1);
                    } else {
                        i++
                    }
                }
            }
        }

        // Second pass: allow full groups to have 
        // an extra student with matching interest
        for (let group of groups) {
            if (group.student_ids.length <= target_group_size) {
                for (let i = 0; i < could_not_be_grouped.length; i++) {
                    if (could_not_be_grouped[i].interest == group.common_interest) {
                        group.student_ids.push(could_not_be_grouped[i].id); 
                        could_not_be_grouped.splice(i, 1);
                        break;
                    }
                }
            }   
        }

        // Third pass: if some groups are smaller than the
        // target group size, add a random person in it
        while (could_not_be_grouped.length > 0){
            let student = could_not_be_grouped[0];

            let groups_are_all_full = true;

            for (let group of groups) {
                if (group.student_ids.length < target_group_size) {
                    groups_are_all_full = false;
                    group.student_ids.push(student.id);
                    could_not_be_grouped.splice(0, 1);
                    break;
                }
            }

            if (groups_are_all_full) {
                break;
            }
        }

        // fourth pass: throw the rest together
        // and if they start whining tell them
        // to stop being picky
        while (could_not_be_grouped.length > 0) {
            let group = new Group(class_id, groups.length);
           
            while (group.student_ids.length < target_group_size) {
                let student = could_not_be_grouped.pop();

                // If student is null, we ran out of students
                if (student == null) {
                    break;
                }
                group.student_ids.push(student.id);
            }

            groups.push(group);
        }

        return groups;
    }

    /*static make_groups_on_year(class_id: number, students: Student[], target_group_size: number = 5) : Group[] {
        
        //stable marriage alg
        let groupMap = new Map();
        let target_group_number = Math.round(students.length / target_group_size);
        let groups = [];

        

        for(let [i, student] of students.entries()){
            groups.push(new Group(class_id, i))
        }

        
        
            Preference Rankings
            1. Interest
            2. Degree
            3. Year (higher is better than lower)

            
            Example:
            
            Group 1:
            Person 1 (Cybersecurity, Software Engineering, Year 4)
            Person 2 (Cybersecurity, Software Engineering, Year 3)
            Person 3 (Cybersecurity, Software Engineering, Year 3)

            Group 2:
            Person 1 (Cybersecurity, Computer Science, Year 4)
            Person 2 (Networking, Software Engineering, Year 3)
            Person 3 (Networking, Computer Science, Year 4)

            Group 2:
            Person 1 (Networking, Computer Science, Year 1)
            Person 2 (Networking, Software Engineering, Year 3)
            Person 3 (Business Requirements, Business Studies, Year 2)

        */


        /*
        1. DAY 1 Of Algorithm
            - All Students are assigned into an interest that they have selected.

        2. DAY 2 of Algorithm
            -if a group is too large, anyone with < 2 matching preferences are kicked.
        
        3. Day 3 of Algorithm
            - if a group is still too big, anyone that has < 3 matching prefrences is kicked.

        */


        

            /*
        Using the Stable Marriage Algorithm: 

        ranking required.

        1. DAY 1 Of Algorithm (interests)
            - All Students are assigned into the interest they have selected.
            - The interest checks their degree and keeps similar degrees. (tentative engagements) 

        2. DAY 2 of Algorithm
            - Anyone that is not grouped, proposes their second interest (?Random for us)
            - the interest checks everyone's degrees and removes anyone not similar. 
        
        3. Day 3 of Algorithm
            - repeat until

        

        

        return groups;
    }*/

    constructor(class_id: number, id: number) {
        this.class_id        = class_id;
        this.id              = id
        this.student_ids     = [];
        this.common_interest = "";
    }
}


export = Group;
