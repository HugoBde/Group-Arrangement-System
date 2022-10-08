const class_table_body = document.getElementById("class_table_body"); 

async function get_class() {
    // Make a get request for the list of group members
    let response = await fetch("/class_info");

    // The backend should return an array of strings containing the names
    let students = await response.json();

    fill_table(students);
}

async function random_groups() {
    // Ask the backend to generate groups randomly
    let response = await fetch("/make_groups_random");

    let students = await response.json();

    fill_table(students);
}

async function clear_groups() {
    let response = await fetch("/clear_groups");

    let students = await response.json();

    fill_table(students);
}

function clear_table() {
    while(class_table_body.rows.length != 0) {
      class_table_body.deleteRow(0)
    }
}

// Fill the class table with the students array
function fill_table(students) {
    // Sort the student array based on their group id so
    // that the table looks a little neater
    // The sorting function makes students with no groups go
    // last 
    students.sort(function (a, b) {
        if(a.group_id === -1) {
            return 1;
        }
        if (b.group_id === -1) {
            return -1;
        }
        return a.group_id - b.group_id;
    });

    clear_table();

    // Loop through the names and create a row for each student
    for (let student of students) {
        let new_row = document.createElement("tr");
        let name_cell = document.createElement("td");
        let group_cell = document.createElement("td");
        name_cell.textContent = `${student.first_name} ${student.last_name}`;
        if (student.group_id == -1) {
            group_cell.textContent = "-";
        } else {
            group_cell.textContent = student.group_id + 1;
        }
        name_cell.classList.add('text-xl', 'border-r', 'py-2');
        group_cell.classList.add('text-xl');
        new_row.appendChild(name_cell);
        new_row.appendChild(group_cell);
        new_row.classList.add('border', 'hover:bg-gray-700', 'hover:cursor-text', 'py-2');
        class_table_body.appendChild(new_row);
    }
}

// Call the function above
get_class();
