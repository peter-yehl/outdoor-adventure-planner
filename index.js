// Load card data from JSON file and display it on the main page
async function loadCards() {
  const response = await fetch("data/index-cards.json");
  const cards = await response.json();

  const container = document.getElementById("card-container");

  // Create card elements for each entry in the JSON data and add them to the container
  cards.forEach(card => {
    const col = document.createElement("div");
    col.className = "col";

    // Set up the card structure with image, title, text, and link based on the JSON data
    col.innerHTML = `
        <div class="card shadow-sm card-hover" style="--card-border-color:${card.color}">
        <img src="${card.image}" class="card-img-top" alt="${card.title}">
        <div class="card-body text-center">
            <h3>${card.title}</h3>
            <p class="card-text">${card.text}</p>
            <a href="${card.link}" class="btn btn-primary">Open</a>
        </div>
        </div>
    `;

    container.appendChild(col);
  });
}

loadCards();