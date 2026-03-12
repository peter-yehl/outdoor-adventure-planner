const currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || {};
let editingIndex = null;

if (!currentUser) {
    window.location.href = "login.html";
}

let trips = users[currentUser].trips;

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

//Create
//Add new trip to user's trips array and save to local storage
function addTrip() {
    const name = document.getElementById("tripName").value;
    const location = document.getElementById("tripLocation").value;

    if (!name || !location) return;

    trips.push({ name, location });

    users[currentUser].trips = trips;
    saveUsers();
    displayTrips();

    document.getElementById("tripName").value = "";
    document.getElementById("tripLocation").value = "";
}

//Read
//Display user's trips in a card format with buttons to view/edit details
function displayTrips() {
  const container = document.getElementById("trips-container");
  container.innerHTML = "";

  trips.forEach((trip, index) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    //Create card for each trip with details and onclick to edit
    col.innerHTML = `
    <div class="card shadow-sm card-hover h-100" onclick="editTrip(${index})" style="cursor:pointer;">
      <div class="card-body">
        <h4>${trip.name}</h4>
        <p><strong>Location:</strong> ${trip.location}</p>
        <p><strong>Trails:</strong> ${trip.trails ? trip.trails.join(", ") : "N/A"}</p>
        <p><strong>Climbing:</strong> ${trip.climbing ? trip.climbing.join(", ") : "N/A"}</p>
        <p><strong>Camping:</strong> ${trip.camping ? trip.camping.join(", ") : "N/A"}</p>
      </div>
    </div>
    `;

    container.appendChild(col);
  });
}

//Update
//Open modal to edit trip details, allowing user to view/add/remove trails, climbs, and camping
function editTrip(index) {
  editingIndex = index;
  const trip = trips[index];

  document.getElementById("editModalTitle").textContent = trip.name;
  document.getElementById("editLocation").value = trip.location;

  renderList("trailsList", trip.trails || [], "trails");
  renderList("climbsList", trip.climbing || [], "climbing");
  renderList("campingList", trip.camping || [], "camping");

  const modal = new bootstrap.Modal(document.getElementById("tripModal"));
  modal.show();
}

//Helper function to render lists of trails, climbs, and camping in the edit modal
function renderList(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  
  //If no items, show message
  if (items.length === 0) {
    container.innerHTML = "<p class='text-muted'>No items added yet.</p>";
    return;
  }

  //Create buttons for each item with onclick to view details and remove
  items.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "d-flex justify-content-between align-items-center mb-2";

    //Create button to view item details and button to remove item from trip
    row.innerHTML = `
      <button class="btn btn-outline-primary flex-grow-1 text-start" onclick="openItemCard('${item}', '${type}')">
        ${item}
      </button>

      <button class="btn btn-danger btn-sm ms-2"
        onclick="removeItem('${type}', ${i})">
        -
      </button>
    `;

    container.appendChild(row);
  });
}

//Helper function to open modal with item details when clicking on a trail, climb, or camping spot in the edit trip modal
function openItemCard(name, type) {
  const container = document.getElementById("viewItemContent");

  let dataSource = [];

  //Determine which data source to pull from based on type (trails, climbs, camping)
  if (type === "trails") dataSource = JSON.parse(localStorage.getItem("trailsData")) || [];
  if (type === "climbing") dataSource = JSON.parse(localStorage.getItem("climbingData")) || [];
  if (type === "camping") dataSource = JSON.parse(localStorage.getItem("campingData")) || [];

  const item = dataSource.find(i => i.name === name);

  //Display all attributes of the item in the modal, checking if they exist before displaying
  container.innerHTML = `
    <div class="card shadow-sm">
      <img src="${item.image}" class="card-img-top">
      <div class="card-body">
        <h4>${item.name}</h4>
        <p><strong>Location:</strong> ${item.location}</p>
        ${item.difficulty ? `<p><strong>Difficulty:</strong> ${item.difficulty}</p>` : ""}
        ${item.type ? `<p><strong>Type:</strong> ${item.type}</p>` : ""}
        ${item.distance ? `<p><strong>Distance:</strong> ${item.distance}</p>` : ""}
        ${item.amenities ? `<p><strong>Amenities:</strong> ${item.amenities}</p>` : ""}
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById("viewItemModal"));
  modal.show();
}

//Save changes to trip details and update local storage, then refresh displayed trips
function saveTrip() {
  if (editingIndex === null) return;

  trips[editingIndex].name =
    document.getElementById("editModalTitle").textContent.trim();

  trips[editingIndex].location =
    document.getElementById("editLocation").value;

  users[currentUser].trips = trips;
  saveUsers();
  displayTrips();

  bootstrap.Modal.getInstance(document.getElementById("tripModal")).hide();
}

//Remove item from trip's trails, climbs, or camping arrays based on type and index, then save changes and refresh edit modal
function removeItem(type, index) {
  const trip = trips[editingIndex];

  trip[type].splice(index, 1);

  users[currentUser].trips = trips;
  saveTrip();
  editTrip(editingIndex);
}

//Delete
//Remove trip from user's trips array and save to local storage, then refresh displayed trips
function deleteTrip() {
  if (editingIndex === null) return;

  trips.splice(editingIndex, 1);

  users[currentUser].trips = trips;
  saveUsers();
  displayTrips();

  bootstrap.Modal.getInstance(document.getElementById("tripModal")).hide();
}

displayTrips();