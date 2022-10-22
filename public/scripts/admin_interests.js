
const interest_table_body = document.getElementById("interest_table_body");
const interest_table = document.getElementById("interest_table");

async function get_interestsList() {
    let response = await fetch("/interests");
    let interest_names = await response.json();
    for (let interest_name of interest_names) {

        let new_row = document.createElement("tr");
        let name_cell = document.createElement("td");

        let add_interest = document.createElement("INPUT");
        add_interest.setAttribute("type", "checkbox");

        name_cell.textContent = interest_name;
        name_cell.classList.add('text-xl', 'border-r', 'py-2');

        new_row.append(name_cell);
        new_row.append(add_interest);

        name_cell.classList.add('text-xl', 'border-r', 'py-2');
        new_row.classList.add('border', 'hover:bg-gray-300', 'hover:cursor-text', 'py-2');
        interest_table_body.appendChild(new_row);
    }
}

// Call the function above
get_interestsList();