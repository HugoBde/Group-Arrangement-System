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
        interest_selection.options.add(new_option);
    }
}

//working function for table
/*async function get_interests() {
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
get_interests();