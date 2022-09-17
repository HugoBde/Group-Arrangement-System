// Get the table body element
const group_table_body = document.getElementById("group_table_body");
const group_table      = document.getElementById("group_table");
const no_group_msg     = document.getElementById("no_group_msg");

// Function is async so we can use await keyword
async function get_group_members() {

    // Make a get request for the list of group members
    let response = await fetch("/group_members");

    // The backend should return an array of strings containing the names
    let student_names = await response.json();

    if (student_names.length === 0) {
        no_group_msg.style.display = "flex";
        return;
    } else {
        group_table.style.display = "block";
    }
    // Loop through the names and create a row for each student
    for(let student_name of student_names) {
        let new_row = document.createElement("tr");
        let name_cell = document.createElement("td");
        let role_cell = document.createElement("td");
        name_cell.textContent = student_name;
        role_cell.textContent = "TBD";
        new_row.appendChild(name_cell);
        new_row.appendChild(role_cell);
        group_table_body.appendChild(new_row);
    }
}

// Call the function above
get_group_members();