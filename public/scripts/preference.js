const interest_selection = document.getElementById("interest_selection");
const form               = document.getElementById("form");

form.addEventListener("submit", submit_preferences)

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

async function submit_preferences(event) {
    event.preventDefault()

    let form_data = new FormData(form);
    let payload   = {};
    
    for (let field of form_data) {
        payload[field[0]] = field[1];
    }

    let result = await fetch("/pref_form_submit", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(payload),
    });

    if (result.status == 200) {
        alert("Preferences updated successfully")
    } else if (result.status == 403) {
        alert("Preferences cannot be changed when student is in a group. Ask your teacher to remove you from the group")
    } else {
        alert("An error occured. Please try again later");
    }
}

get_interests();