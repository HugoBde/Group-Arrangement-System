//Third Party Imports
import mongodb = require("mongodb");

//Local Imports
import Class = require("./class");

class Student {
    // Personal details 
    id:            number;
    first_name:    string;
    last_name:     string;
    email_address: string;
    password:      string;
    group_id:      number;
    class_id:      number;
    preferences:   string[] = ["degree", "year", "interest"];
    //degree:        string[];
    //year:          string[];
    interest:      string;

    constructor(id: number, first_name: string, last_name: string, email_address: string, password: string, interest: string) {
        this.id            = id;
        this.first_name    = first_name;
        this.last_name     = last_name;
        this.email_address = email_address;
        this.password      = password;
        this.group_id      = -1; // -1 means no group assigned
        this.class_id      = 0; // to change
        this.preferences   = []; 
        //this.degree        = degree;
        //this.year          = year;
        this.interest      = interest;
    }
}

export = Student;
