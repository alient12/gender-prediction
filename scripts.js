// Event listener for form submission
document.getElementById('prediction-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevents the default form submission behavior
    
    // Fetch API request to genderize.io
    let name = document.getElementById('fname').value;
    if (!IsNameValid(name)){
        return;
    }

    fetch(`https://api.genderize.io?name=${name}`)
        .then(response => response.json())
        .then(data => {
            let gender = data.gender;
            let probability = data.probability;

            // Display prediction
            if (probability == 0){
                ShowMessage("error-p", "Error:", "The input name is not in the database!");
            } else{
                ShowMessage("prediction-p", CapitalizeFirstLetter(gender), probability);
            }

            // Display saved gender if available
            if (localStorage.getItem(name) !== null){
                let saved = localStorage.getItem(name)
                document.getElementById('saved-p').innerText = CapitalizeFirstLetter(saved);
                document.getElementById("saved-container").hidden = false;
            } else{
                document.getElementById("saved-container").hidden = true;
            }
        })
        .catch(function(error){
            ShowMessage("error-p", "Error:", error.message);
            console.error('Error:', error)
        });
});

// Event listener for save button click
document.getElementById('save-btn').addEventListener('click', function() {
    try {
        let name = document.getElementById('fname').value;
        if (!IsNameValid(name)){
            return;
        }

        let radio = document.querySelector('input[name="gender"]:checked')
        if (radio == null){
            ShowMessage("error-p", "Error:", "Gender not selected");
            return;
        }
        let gender = radio.value;

        localStorage.setItem(name, gender);
        ShowMessage("success-p", "Saved", "");
    } catch (error) {
        ShowMessage("error-p", "Error:", error.message);
        console.error('Error:', error)
    }
});

// Event listener for clear button click
document.getElementById('clear-btn').addEventListener('click', function() {
    try {
        let name = document.getElementById('fname').value;
        if (!IsNameValid(name)){
            return;
        }
        localStorage.removeItem(name)
        ShowMessage("success-p", "Removed", "");
    } catch (error) {
        ShowMessage("error-p", "Error:", error.message);
        console.error('Error:', error)
    }
});

// Display message in the prediction container
function ShowMessage(className, text1, text2){
    document.getElementById('prediction-p-container').className = className;
    document.getElementById('prediction-gender').innerText = text1;
    document.getElementById('prediction-probability').innerText = text2;
}

// Validate input name
function IsNameValid(name){
    if (name.length > 255 || name.length == 0) {
        ShowMessage("error-p", "Error:", "Invalid name. Input name must be 1-255 characters.");
        return false;
    }
    if (name == "X Æ A-12"){
        ShowMessage("error-p", "Invalid name Elon!", "#drive_out_elon_of_earth");
        return false;
    }
    if (!/^[A-Za-z\s]*$/.test(name)){
        ShowMessage("error-p", "Error:", "Invalid name. Only English letters and spaces.");
        return false;
    }
    if (!/[A-Za-z]/.test(name)){
        ShowMessage("error-p", "Error:", "Invalid name. At least one English character is required.");
        return false;
    }
    return true;
}

// Capitalize the first letter of a string
function CapitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
