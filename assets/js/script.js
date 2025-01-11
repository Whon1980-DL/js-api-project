const API_KEY = "YJnxKn4mY_wXv94Oc5x9YetONQ8";
const API_URL = "https://ci-jshint.herokuapp.com/api"; // this is so that we don't have to type the URL every time we need
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal")) // Reference to our modal that allow the modal to be trigger by Bootsrap

document.getElementById("status").addEventListener("click", e => getStatus(e)); // e is reference to the event. This code wire up the check key button
document.getElementById("submit").addEventListener("click", e => postForm(e)); // wiring run check button to a code for post

async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));
    // This for loop is to test if the form is working
    //for (let entry of form.entries()) { 
        /* if you want to confirm  that the form has captured correctly. 
        Then the formData object has several default  methods that allow us to manipulate the data. 
        One of these, is the entries method. Which  we can iterate through to see the form entries.
        */
            //console.log(entry);
        // }
    const response = await fetch(API_URL, { // As fecth() return a promise we need to use await
                    method: "POST", // method and header here are the second argument
                    headers: {
                            "Authorization": API_KEY,
            },
                    body: form, //attach the form as the body of the request
         })

    const data = await response.json();

    if (response.ok) {
         displayErrors(data);
    } else {
        throw new Error(data.error)
    }
}

function displayErrors(data) {
    
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`
        }
    }
    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();

}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString); //use await to wait for the funciton to return the promise 
    
    const data = await response.json(); // use await as json also return a promise... the return info will either be the key expiry date or error message

    if (response.ok) { /* If everything has gone well, a property is set on the response object.
        And this property is the “ok” property. If the server returns the HTTP status code of 200 then, then you’ll remember, our request
        has been successful and the “ok” property will be set to True. If it returns an error code, then the “ok” property will be set to false.
        */
        displayStatus(data);
    } else {
        throw new Error(data.error); // data.error is the descriptive message from the json that's been returned
    }
}

function  displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}


