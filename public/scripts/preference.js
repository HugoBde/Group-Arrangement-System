// Get the table body element
//const preference_table_body = document.getElementById("preference_table_body");
//const preference_table = document.getElementById("preference_table");
//const selection = document.getElementById("checkbox");

const interest_selection = document.getElementById("interest_selection");

async function get_interests() {
    let response = await fetch("/interests");
    let preference_names = await response.json();
    for(let preference_name of preference_names) {
        
        let new_option = document.createElement("option");
        new_option.text = preference_name;
        
        //new_option.value = preference_name;
        new_option.setAttribute("name", preference_name);
        
        interest_selection.options.add(new_option);
    }
}

//Getting students for a table...
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
/*
//Getting interests for a table...
async function get_interests() {
    let response = await fetch("/interests");
    let preference_names = await response.json();
    for(let preference_name of preference_names) {
        
        let new_row = document.createElement("tr");
        let name_cell = document.createElement("td");
        
        let add_pref = document.createElement("INPUT");
        add_pref.setAttribute("type", "checkbox");
        
        
        name_cell.textContent = preference_name;
        name_cell.classList.add('text-xl', 'border-r', 'py-2');
        
        new_row.append(name_cell);
        new_row.append(add_pref);

        name_cell.classList.add('text-xl', 'border-r', 'py-2');
        new_row.classList.add('border', 'hover:bg-gray-700', 'hover:cursor-text', 'py-2');
        preference_table_body.appendChild(new_row);
    }
}*/

// Call the function above
//get_all_not_grouped();
get_interests();