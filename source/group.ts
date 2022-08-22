import Student = require("./student");

var maxvalue = 5;

export class Group {
    students: Student[] = new Array(maxvalue);

    constructor() {
        //let students: [string, string, string, string, string];
        this.students = [];
    }

}