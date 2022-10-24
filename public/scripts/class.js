const class_table_body = document.getElementById("class_table_body");
const group_size_slider = document.getElementById("group_size_slider");

const table_container = document.getElementById("table_container");

async function get_class() {
    // Make a get request for the list of group members
    let response = await fetch("/class_info");

    // The backend should return an array of strings containing the names
    let class_info = await response.json();

    // The backend either returns [[students]] if the groups have not been made
    // or [[group1], [group2], ..., [groupN]] if the groups have been made
    // This way looking at the length of the array tells us which function
    // to call to display the class properly 
    if (class_info.length == 1) {
        fill_table_no_groups(class_info[0]);
    } else {
        fill_tables_groups(class_info);
    }
}

async function random_groups() {
    // Ask the backend to generate groups randomly
    let response = await fetch(`/make_groups_random/${group_size_slider.value}`);

    let students = await response.json();

    fill_tables_groups(students);
}

async function preference_groups() {
    let response = await fetch(`/make_groups_on_preference/${group_size_slider.value}`);
    
    let students = await response.json();
    
    fill_tables_groups(students);
}

async function clear_groups() {
    let response = await fetch("/clear_groups");

    let students = await response.json();

    fill_table_no_groups(students[0]);
}

function clear_tables() {
    let table;
    while((table = table_container.lastElementChild) != null) {
      table_container.removeChild(table);
    }
}

function group(students){
    for (let i = 0; i < 1 << n; i++) {
            let group_head = document.createElement("th");
            thead.add("min-w-[50%] border-2 bg-gray-400 text-center outline outline-offset-4 outline-pink-400 hover:cursor-text");

            for(let student of students){
                let group_row = document.createElement("tr");
                let name_cell = document.createElement("td");
                let group_cell = document.createElement("td");
                name_cell.textContent = `${student.first_name} ${student.last_name}`;
                if (student.group_id == -1) {
                    group_cell.textContent = "-";
                } else {
                    group_cell.textContent = student.group_id + 1;
                }
                group_row.appendChild(name_cell);

            }
        let class_table = document.createElement("class_table_body");
    }
};

function fill_table_no_groups(students) {
    clear_tables()

    let new_table   = document.createElement("table");

    new_table.classList.add("min-w-[100%]", "border-2", "bg-gray-400", "text-center", "outline", "outline-offset-4", "outline-pink-400", "hover:cursor-text");

    // Create Table header
    let new_header  = document.createElement("thead");
    let row         = document.createElement("tr");
    let header_cell = document.createElement("th");
    
    header_cell.innerText = "Students"
    header_cell.colSpan   = 2;

    new_table.appendChild(new_header).appendChild(row).appendChild(header_cell);
    
    // Create table body
    let table_body = document.createElement("tbody");

    for (let student of students) {
        let new_row       = document.createElement("tr");
        let name_cell     = document.createElement("td");
        let interest_cell = document.createElement("td");
        
        name_cell.innerText     = `${student.first_name} ${student.last_name}`;
        interest_cell.innerText = student.interest || "-";

        name_cell.classList.add('text-xl', 'border-r', 'py-2');
        interest_cell.classList.add('text-xl', "py-2");
        new_row.classList.add('border', 'hover:bg-gray-300', 'hover:cursor-text', 'py-2');

        table_body.appendChild(new_row).append(name_cell, interest_cell);
    }

    new_table.appendChild(table_body);

    table_container.appendChild(new_table);
}

// Fill the class table with the students array
function fill_tables_groups(groups) {

    clear_tables()

    // Sort the student array based on their group id so
    // that the table looks a little neater
    // The sorting function makes students with no groups go
    // last 

    for (let [group_id, group] of groups.entries()) {
        // Create table
        let new_table   = document.createElement("table");

        new_table.classList.add("border-2", "bg-gray-400", "text-center", "outline",
                                "outline-offset-4", "outline-pink-400", "hover:cursor-text",
                                "w-96", "table-fixed", "grow-0", "mb-10");

        // Create Table header
        let new_header  = document.createElement("thead");
        let row         = document.createElement("tr");
        let header_cell = document.createElement("th");

        header_cell.innerText = `Group ${group_id + 1}`;
        header_cell.colSpan   = 2;
        
        new_table.appendChild(new_header).appendChild(row).appendChild(header_cell);
        
        // Create table body
        let table_body = document.createElement("tbody");

        for (let student of group) {
            let new_row       = document.createElement("tr");
            let name_cell     = document.createElement("td");
            let interest_cell = document.createElement("td");

            name_cell.innerText     = `${student.first_name} ${student.last_name}`;
            interest_cell.innerText = student.interest || "-";

            name_cell.classList.add('text-xl', 'border-r', 'py-2');
            interest_cell.classList.add('text-xl');
            new_row.classList.add('border', 'hover:bg-gray-300', 'hover:cursor-text', 'p-2');

            table_body.appendChild(new_row).append(name_cell, interest_cell);
        }

        new_table.appendChild(table_body); 

        table_container.appendChild(new_table);
    }

    // ============================================================
    // students.sort(function (a, b) {
    //     if(a.group_id === -1) {
    //         return 1;
    //     }
    //     if (b.group_id === -1) {
    //         return -1;
    //     }
    //     return a.group_id - b.group_id;
    // });

    // clear_table();

    // // Loop through the names and create a row for each student
    // for (let student of students) {
    //     let new_row = document.createElement("tr");
    //     let name_cell = document.createElement("td");
    //     let group_cell = document.createElement("td");
    //     name_cell.textContent = `${student.first_name} ${student.last_name}`;
    //     if (student.group_id == -1) {
    //         group_cell.textContent = "-";
    //     } else {
    //         group_cell.textContent = student.group_id + 1;
    //     }
    //     name_cell.classList.add('text-xl', 'border-r', 'py-2');
    //     group_cell.classList.add('text-xl');
    //     new_row.appendChild(name_cell);
    //     new_row.appendChild(group_cell);
    //     new_row.classList.add('border', 'hover:bg-gray-300', 'hover:cursor-text', 'py-2');
    //     class_table_body.appendChild(new_row);
    // }
}

// Call the function above
get_class();
