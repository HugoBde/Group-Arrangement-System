import e from "express";
import * as Utils from "./utils";

export class Student {
    // Personal details 
    id  : number;
    first_name: string;
    last_name:  string;
    email_address: string;
    password:      string;

    constructor(id: number, first_name: string, last_name: string, email_address: string, password: string) {
        this.id            = id ;
        this.first_name    = first_name ;
        this.last_name     = last_name ;
        this.email_address = email_address ;
        this.password      = password  ;
    }

}