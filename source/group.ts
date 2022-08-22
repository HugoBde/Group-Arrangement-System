import Student = require("./student");

export class Group {
    students: Student[] = [];

    constructor() {
        let students: [string, string, string, string, string];
        this.students = [];
    }

}