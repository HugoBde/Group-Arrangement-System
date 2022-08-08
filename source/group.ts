import {Student} from "./student"

export enum GROUPING_MODE {
    GROUP_SIZE,
    GROUP_NUMBER,
};

export class Group {
    students: Student[] = [];

    constructor() {
        this.students = [];
    }

    display() {
        for(let i = 0; i < this.students.length; i++) {
            this.students[i].display();
        }
    }
}

export function make_groups (cohort: Student[], grouping_mode: GROUPING_MODE, param: number) {
    let target_group_number;
    let target_group_size;

    let groups : Group[] = [];
    
    if (grouping_mode == GROUPING_MODE.GROUP_SIZE) {
        target_group_size = param;
        target_group_number = Math.round(cohort.length / target_group_size);
    } else if (grouping_mode == GROUPING_MODE.GROUP_NUMBER) {
        target_group_number = param;
        target_group_size = Math.round(cohort.length / target_group_number);
    } else {
        return groups;
    }

    for(let i = 0; i < target_group_number; i++) {
        groups.push(new Group());
    }

    for(let i = 0; i < cohort.length; i++) {
        groups[i % target_group_number].students.push(cohort[i]);
    }

    return groups;
}