import "express-session";

import Student = require("./student");
import Teacher = require("./teacher");

declare module "express-session" {
    interface SessionData {
        user     : Student | Teacher;
        is_admin : boolean;
    }
}
