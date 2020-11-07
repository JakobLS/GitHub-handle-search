'use-strict';


function formatQueryParameters(params) {
    // Function for formatting the query parameters into a url.
    // Using the encodeURIComponent for formatting might be useful in some cases. 
    const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`);
    return queryItems.join('&');
}

function createGithubURL(userName, nbrResults=25) {
    // Function for creating a string based on the user input query
    const params = {
        page: 1,
        per_page: nbrResults,
        sort: "updated"
    };
    const queryString = formatQueryParameters(params);
    return `https://api.github.com/users/${userName}/repos` + '?' + queryString;
}

function getGithubHandle(urlString) {
    // Function for fetching the search term
    fetch(urlString)
        .then(response => response.json())
        .then(responseJson => displayResults(responseJson))
        .catch(error => alert(`${error.message}`));
}

function generateOutputElement(output) {
    // Function for generating output string
    return `<div class="output-element">
                <p class="repo-name">Repo name: ${output.name}</p>
                <p class="repo-url">Url: <a href="${output.url}" target="_blank">${output.url}</a></p>
            </div>`;
}

function generateOutputString(outputList) {
    // Function for generating the output string
    const searchOutput = outputList.map(output => generateOutputElement(output));
    return searchOutput.join("");
}

function cleanResponse(responseJson) {
    // Function for removing non relevant information
    const userRepos = [];
    for (let i=0; i < responseJson.length; i++) {
        userRepos.push({name: responseJson[i].name, 
                        url: responseJson[i]['html_url']});
    };
    return userRepos;
}

function displayResults(responseJson) {
    // Function for displaying the results in the DOM
    const cleanedResponse = cleanResponse(responseJson);
    const outputString = generateOutputString(cleanedResponse);
    $('.js-output-section').html(outputString);
}

function searchButtonClicked() {
    // Functionality for when the Search button is clicked
    $('#js-search-form').submit(event => {
        event.preventDefault();
        let searchTerm = $('.js-search-entry').val();
        const urlString = createGithubURL(searchTerm);
        getGithubHandle(urlString);
    });
}


function main() {
    searchButtonClicked();
}

$(main);

