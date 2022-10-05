// Local import 
import mongodb = require("mongodb");

class Teacher {
    // Personal details 
    id:            number;
    first_name:    string;
    last_name:     string;
    email_address: string;
    password:      string;
    class_id:      number;

    constructor(id: number, first_name: string, last_name: string, email_address: string, password: string) {
        this.id            = id; 
        this.first_name    = first_name;
        this.last_name     = last_name;
        this.email_address = email_address;
        this.password      = password;
        this.class_id      = -1; // -1 means no group assigned

    }
}

export = Teacher;
