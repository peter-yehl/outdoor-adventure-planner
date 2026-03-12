let campingData = [];
let filteredCamping = [];
let page = 1;
const campingPerPage = 12;

//Load camping data from JSON file and store in localStorage
async function loadCamping() {
    const response = await fetch("../data/camping.json");
    campingData = await response.json();

    localStorage.setItem("campingData", JSON.stringify(campingData));

    filteredCamping = campingData;
    setupPagination();
    displayCamping();
}

//Display camping cards on the page
function displayCamping() {
    const container = document.getElementById("camping-container");
    container.innerHTML = "";

    //Determine which camping locations to show based on current page and filters
    const start = (page - 1) * campingPerPage;
    const end = start + campingPerPage;
    const shownCamping = filteredCamping.slice(start, end);

    shownCamping.forEach(camp => {
        const col = document.createElement("div");
        col.className = "col-md-3 d-flex";

        //Create card format for each camp
        col.innerHTML = `
            <div class="card shadow-sm card-hover position-relative w-100 h-100">
            <img src="${camp.image}" class="card-img-top" alt="${camp.name} Image">
            <div class="card-body">
                <h4>${camp.name}</h4>
                <p><strong>Location:</strong> ${camp.location}</p>
                <p><strong>Type:</strong> ${camp.type}</p>
                <p><strong>Amenities:</strong> ${camp.amenities}</p>
            </div>
            <button class="btn btn-success btn-sm position-absolute bottom-0 end-0 m-2"
            onclick="displayTrips('${camp.name}')">
            +
            </button>
            </div>
        `;

        container.appendChild(col);
    });
}

//Display list of user's trips to add the selected camp to
function displayTrips(campName) {
    selectedCamp = campName;

    //Get current user's trips from localStorage
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const trips = users[currentUser]?.trips || [];

    const list = document.getElementById("trip-list");
    list.innerHTML = "";

    //Create a button for each trip that the user can click to add the camp to that trip
    trips.forEach((trip, index) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary w-100 mb-2";
        btn.textContent = trip.name;

        //When the button is clicked, call the function to add the camp to that trip
        btn.onclick = () => {
            addCampToTrip(index);
        };

        list.appendChild(btn);
    });

    const modal = new bootstrap.Modal(document.getElementById("addCampingModal"));
    modal.show();
}

//Add the selected camp to the selected trip in localStorage
function addCampToTrip(tripIndex) {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    const trips = users[currentUser].trips;

    //If the trip doesn't have a camping array yet, create it
    if (!trips[tripIndex].camping) {
        trips[tripIndex].camping = [];
    }

    //Add the selected camp to the trip's camping array if it's not already there
    if (!trips[tripIndex].camping.includes(selectedCamp)) {
        trips[tripIndex].camping.push(selectedCamp);
    }

    //Save the updated trips back to localStorage
    users[currentUser].trips = trips;
    localStorage.setItem("users", JSON.stringify(users));

    //Close the modal after adding the camp to the trip
    bootstrap.Modal.getInstance(document.getElementById("addCampingModal")).hide();
}

//Filter camping locations based on user input for location and type
function filterCamping() {
    const locationInput = document.getElementById("locationSearch").value.toLowerCase();

    //Get selected type from dropdown
    const typeFilter = document.getElementById("typeFilter").value;
    
    filteredCamping = campingData.filter(camp => {
        const matchesLocation = camp.location.toLowerCase().includes(locationInput);
        const matchesType = typeFilter === "" || camp.type === typeFilter;

        return matchesLocation && matchesType;
    });

    //After filtering, reset to page 1 and update the displayed camping locations and pagination buttons
    page = 1;
    setupPagination();
    displayCamping();
}

//setup pagination buttons based on number of camping locations after filtering
function setupPagination(){
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    //Calculate how many pages are needed based on number of filtered camping locations
    const pageCount = Math.ceil(filteredCamping.length / campingPerPage);

    //Dynamically create pagination buttons
    for (let i = 1; i <= pageCount; i++){
        const btn = document.createElement("button");
        btn.className = i === page ? "btn btn-primary mx-1" : "btn btn-outline-primary mx-1";
        btn.textContent = i;

        //When a pagination button is clicked, update the current page, re-render the camping locations and pagination buttons, and scroll to the top of the page
        btn.addEventListener("click", () => {
            page = i;
            displayCamping();
            setupPagination();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        pagination.appendChild(btn);
    }
}

document
    .getElementById("locationSearch")
    .addEventListener("input", filterCamping);

document
    .getElementById("typeFilter")
    .addEventListener("change", filterCamping);

loadCamping();