import { reverse } from "dns";
import Student = require("./student");

var maxvalue = 5;

export class Group {
    students: Student[] = new Array(maxvalue);

    constructor() {
        //let students: [string, string, string, string, string];
        this.students = [];
    }
    //document.getElementById('').columns
    /*if (team1.length < maxvalue) {
        team1.push(x)
    }
    else if (team2.length < maxvalue){
        team2.push(x)
    }*/

}
