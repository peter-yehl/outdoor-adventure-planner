let climbingData = [];
let filteredClimbing = [];
let page = 1;
const climbingPerPage = 12;

//Load climbing locations from JSON file and store in localStorage
async function loadClimbing() {
    const response = await fetch("../data/climbing.json");
    climbingData = await response.json();

    localStorage.setItem("climbingData", JSON.stringify(climbingData));


    filteredClimbing = climbingData;
    setupPagination();
    displayClimbing();
}

//Display climbing cards on the page
function displayClimbing() {
    const container = document.getElementById("climbing-container");
    container.innerHTML = "";

    //Determine which climbing locations to show based on current page and filters
    const start = (page - 1) * climbingPerPage;
    const end = start + climbingPerPage;
    const shownClimbing = filteredClimbing.slice(start, end);

    //Create card format for each climb
    shownClimbing.forEach(climb => {
        const col = document.createElement("div");
        col.className = "col-md-3 d-flex";

        //Create card format for each climb
        col.innerHTML = `
            <div class="card shadow-sm card-hover position-relative w-100 h-100">
            <img src="${climb.image}" class="card-img-top" alt="${climb.name} Image">
            <div class="card-body">
                <h4>${climb.name}</h4>
                <p><strong>Location:</strong> ${climb.location}</p>
                <p><strong>Difficulty:</strong> ${climb.difficulty}</p>
                <p><strong>Type:</strong> ${climb.type}</p>
                <p><strong>Distance:</strong> ${climb.distance}</p>
            </div>
            <button class="btn btn-success btn-sm position-absolute bottom-0 end-0 m-2"
            onclick="displayTrips('${climb.name}')">
            +
            </button>
            </div>
        `;

        container.appendChild(col);
    });
}

//Display list of user's trips to add the selected climb to
function displayTrips(climbName) {
    selectedClimb = climbName;

    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const trips = users[currentUser]?.trips || [];

    const list = document.getElementById("trip-list");
    list.innerHTML = "";

    trips.forEach((trip, index) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary w-100 mb-2";
        btn.textContent = trip.name;

        btn.onclick = () => {
            addClimbToTrip(index);
        };

        list.appendChild(btn);
    });

    const modal = new bootstrap.Modal(document.getElementById("addClimbingModal"));
    modal.show();
}

//Add the selected climb to the selected trip in localStorage
function addClimbToTrip(tripIndex) {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    const trips = users[currentUser].trips;

    //If the trip doesn't have a climbing array yet, create it
    if (!trips[tripIndex].climbing) {
        trips[tripIndex].climbing = [];
    }

    //Add the selected climb to the trip's climbing array if it's not already there
    if (!trips[tripIndex].climbing.includes(selectedClimb)) {
        trips[tripIndex].climbing.push(selectedClimb);
    }

    //Save the updated trips back to localStorage
    users[currentUser].trips = trips;
    localStorage.setItem("users", JSON.stringify(users));

    //Close the modal after adding the climb to the trip
    bootstrap.Modal.getInstance(document.getElementById("addClimbingModal")).hide();
}

//Filter climbing locations based on user input for location, difficulty, and type
function filterClimbing() {
    const locationInput = document.getElementById("locationSearch").value.toLowerCase();

    //Get selected difficulty and type from filters
    const difficultyInput = document.getElementById("difficultyFilter").value;
    const typeInput = document.getElementById("typeFilter").value;

    filteredClimbing = climbingData.filter(climb => {
        const matchesLocation = climb.location.toLowerCase().includes(locationInput);
        const matchesDifficulty = difficultyInput === "" || climb.difficulty === difficultyInput;
        const matchesType = typeInput === "" || climb.type === typeInput;

        return matchesLocation && matchesDifficulty && matchesType;
    });

    //After filtering, reset to page 1 and update the displayed climbing locations and pagination buttons
    page = 1;
    setupPagination();
    displayClimbing();
}

//setup pagination buttons based on number of climbing locations after filtering
function setupPagination(){
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    //Calculate how many pages are needed based on number of filtered climbing locations
    const pageCount = Math.ceil(filteredClimbing.length / climbingPerPage);

    //Dynamically create pagination buttons
    for (let i = 1; i <= pageCount; i++){
        const btn = document.createElement("button");
        btn.className = i === page ? "btn btn-primary mx-1" : "btn btn-outline-primary mx-1";
        btn.textContent = i;

        //When a pagination button is clicked, update the current page, re-render the climbing locations and pagination buttons, and scroll to the top of the page
        btn.addEventListener("click", () => {
            page = i;
            displayClimbing();
            setupPagination();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        pagination.appendChild(btn);
    }
}

document
    .getElementById("locationSearch")
    .addEventListener("input", filterClimbing);

document
    .getElementById("difficultyFilter")
    .addEventListener("change", filterClimbing);

document
    .getElementById("typeFilter")
    .addEventListener("change", filterClimbing);

loadClimbing();