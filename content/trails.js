let trailsData = [];
let filteredTrails = [];
let page = 1;
const trailsPerPage = 1;
let selectedTrail = null;

//Load trails data from JSON file and store in local storage, then display first page of trails
async function loadTrails() {
    const response = await fetch("../data/trails.json");
    trailsData = await response.json();

    localStorage.setItem("trailsData", JSON.stringify(trailsData));

    filteredTrails = trailsData;
    setupPagination();
    displayTrails();
}

//Display trails in a card format with button to add trail to a trip, showing only trails for the current page based on pagination
function displayTrails() {
    const container = document.getElementById("trails-container");
    container.innerHTML = "";

    //Calculate start and end index for current page of trails to display
    const start = (page - 1) * trailsPerPage;
    const end = start + trailsPerPage;
    const shownTrails = filteredTrails.slice(start, end);

    //Create card for each trail with details and button to add to trip, then append to container
    shownTrails.forEach(trail => {
        const col = document.createElement("div");
        col.className = "col-md-3 d-flex";

        //Display trail's attributes in card format
        col.innerHTML = `
            <div class="card shadow-sm card-hover position-relative w-100 h-100">
            <img src="${trail.image}" class="card-img-top" alt="${trail.name} Image">
            <div class="card-body">
                <h4>${trail.name}</h4>
                <p><strong>Location:</strong> ${trail.location}</p>
                <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
                <p><strong>Distance:</strong> ${trail.distance}</p>
            </div>
            <button class="btn btn-success btn-sm position-absolute bottom-0 end-0 m-2"
            onclick="displayTrips('${trail.name}')">
            +
            </button>
            </div>
        `;

        container.appendChild(col);
    });
}

//Display list of user's trips, allowing user to select a trip to add the trail to, then show modal to select trip
function displayTrips(trailName) {
    selectedTrail = trailName;

    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const trips = users[currentUser]?.trips || [];

    const list = document.getElementById("trip-list");
    list.innerHTML = "";

    //If no trips, show message
    trips.forEach((trip, index) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary w-100 mb-2";
        btn.textContent = trip.name;

        //When clicking on a trip, add the selected trail to that trip and close the modal
        btn.onclick = () => {
            addTrailToTrip(index);
        };

        //Append button for each trip to the list in the modal
        list.appendChild(btn);
    });

    const modal = new bootstrap.Modal(document.getElementById("addTrailModal"));
    modal.show();
}

//Add the selected trail to the specified trip in the user's trips array, then save to local storage and close the modal
function addTrailToTrip(tripIndex) {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    const trips = users[currentUser].trips;

    //If the trip doesn't have a trails array yet, create one, then add the selected trail to the trip
    if (!trips[tripIndex].trails) {
        trips[tripIndex].trails = [];
    }

    //Only add the trail if it's not already in the trip's trails array to avoid duplicates
    if (!trips[tripIndex].trails.includes(selectedTrail)) {
        trips[tripIndex].trails.push(selectedTrail);
    }

    users[currentUser].trips = trips;
    localStorage.setItem("users", JSON.stringify(users));

    bootstrap.Modal.getInstance(document.getElementById("addTrailModal")).hide();
}

//Filter trails based on location search input and difficulty filter, then reset to page 1 and update displayed trails and pagination
function filterTrails() {
    const locationInput = document.getElementById("locationSearch").value.toLowerCase();

    //If difficulty filter is empty, show all difficulties, otherwise filter by selected difficulty
    const difficultyInput = document.getElementById("difficultyFilter").value;
    filteredTrails = trailsData.filter(trail => {
        const matchesLocation = trail.location.toLowerCase().includes(locationInput);
        const matchesDifficulty = difficultyInput === "" || trail.difficulty === difficultyInput;

        return matchesLocation && matchesDifficulty;
    });

    //Reset to page 1 and update displayed trails and pagination
    page = 1;
    setupPagination();
    displayTrails();
}

//Helper function to open modal with item details when clicking on a trail, climb, or camping spot in the edit trip modal
function setupPagination(){
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const pageCount = Math.ceil(filteredTrails.length / trailsPerPage);

    //Create button for each page and add event listener to update displayed trails when clicking on a page button
    for (let i = 1; i <= pageCount; i++){
        const btn = document.createElement("button");
        btn.className = i === page ? "btn btn-primary mx-1" : "btn btn-outline-primary mx-1";
        btn.textContent = i;

        //When clicking on a page button, update the current page, displayed trails, pagination, and scroll to top of page
        btn.addEventListener("click", () => {
            page = i;
            displayTrails();
            setupPagination();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        pagination.appendChild(btn);
    }
}

document
    .getElementById("locationSearch")
    .addEventListener("input", filterTrails);

document
    .getElementById("difficultyFilter")
    .addEventListener("change", filterTrails);

loadTrails();