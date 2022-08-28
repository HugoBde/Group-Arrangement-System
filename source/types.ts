import "express-session";

import Student = require("./student");

declare module "express-session" {
    interface SessionData {
        user: Student;
    }
}