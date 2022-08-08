import {Student} from "./student"; 
import {GROUPING_MODE, Group, make_groups} from "./group";

const nb_students = 31;

let students: Student[] = []

for (let i = 0; i < nb_students; i++) {
    students.push(new Student());
}

console.log("=== Forming base groups ===");

let groups : Group[] = make_groups(students, GROUPING_MODE.GROUP_SIZE, 4);

for(let i = 0; i < groups.length; i++) {
    console.log(`Group ${i + 1}: ${groups[i].students.length} students`);
    groups[i].display();
    console.log("\n");
}