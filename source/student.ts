import * as Utils from "./utils";

let nb_students: number = 0;
const some_names: string[] = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan",
                              "David", "Edward", "Fred", "Frank", "George",
                              "Hal", "Hank", "Ike", "John", "Jack", "Joe",
                              "Larry", "Monte", "Matthew", "Mark", "Nathan",
                              "Otto", "Paul", "Peter", "Roger", "Roger", "Steve",
                              "Thomas", "Tim", "Ty", "Victor", "Walter"];

enum INTERESTS {
    BACKEND = 0,
    FRONTEND,
    VR,
    AI,

    // Add new interests above this line,
    // this way the numeric value of NB_OF_INTERESTS
    // remains accurates
    NB_OF_INTERESTS
}

export class Student {
    // Personal details 
    name: string;
    id  : number;

    // Interests
    primary_interests   : INTERESTS[] = [];
    secondary_interests : INTERESTS[] = [];
    
    constructor() {
        let index = Math.floor(Math.random() * some_names.length)
        this.name = some_names[index];
        some_names.splice(index, 1);
        this.id   = nb_students;

        nb_students++;
        
        // Add a random primary interest
        this.primary_interests[0] = Utils.random_range(0, INTERESTS.NB_OF_INTERESTS);

        // Add a random secondary interest that is different from the primary one
        while ((this.secondary_interests[0] = Utils.random_range(0, INTERESTS.NB_OF_INTERESTS)) == this.primary_interests[0]);
    }

    display() {
        console.log(`${this.name.padEnd(10)} | ${this.id.toString().padEnd(2)} | ${INTERESTS[this.primary_interests[0]].padEnd(8)} | ${INTERESTS[this.secondary_interests[0]].padEnd(8)} `);
    }
}