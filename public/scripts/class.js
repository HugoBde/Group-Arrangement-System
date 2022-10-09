const class_table_body = document.getElementById("class_table_body");

async function get_class() {

    // Make a get request for the list of group members
    let response = await fetch("/class_info");

    // The backend should return an array of strings containing the names
    let students = await response.json();

    // Loop through the names and create a row for each student
    for (let student of students) {
        let new_row = document.createElement("tr");
        let name_cell = document.createElement("td");
        let group_cell = document.createElement("td");
        name_cell.textContent = `${student.first_name} ${student.last_name}`;
        if (student.group_id == -1) {
            group_cell.textContent = "-";
        } else {
            group_cell.textContent = student.group_id;
        }
        name_cell.classList.add('text-xl', 'border-r', 'py-2');
        group_cell.classList.add('text-xl');
        new_row.appendChild(name_cell);
        new_row.appendChild(group_cell);
        new_row.classList.add('border', 'hover:bg-gray-300', 'hover:cursor-text', 'py-2');
        class_table_body.appendChild(new_row);
    }
}

// Call the function above
get_class();
