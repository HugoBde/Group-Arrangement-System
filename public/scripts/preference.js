// Get the table body element
const group_table_body = document.getElementById("preference_table_body");

// Function is async so we can use await keyword
/*async function get_all_not_grouped() {

    // Make a get request for the list of group members
    let response = await fetch("/not_grouped");

    // The backend should return an array of strings containing the names
    let student_names = await response.json();
    
    // Loop through the names and create a row for each student
    for(let student_name of student_names) {
        let new_row = document.createElement("tr");
        let name_cell = document.createElement("td");
        let role_cell = document.createElement("td");
        name_cell.textContent = student_name;
        role_cell.textContent = "TBD";
        new_row.appendChild(name_cell);
        new_row.appendChild(role_cell);
        preference_table_body.appendChild(new_row);
    }
}*/

async function get_interests() {
    let response = await fetch("/interests");
    let preference_names = await response.json();
    for(let preference_name of preference_names) {
        let new_row = document.createElement("tr");
        let name_cell = document.createElement("td");
        name_cell.textContent = preference_name;
        new_row.append(name_cell);
        group_table_body.appendChild(new_row);
    }
}

// Call the function above
//get_all_not_grouped();
get_interests();