let authorsData = [];

//Fetch and display authors
async function loadAuthors() {
    const response = await fetch("../data/authors.json");
    authorsData = await response.json();
    displayAuthors();
}

//Display authors in Bootstrap accordion
function displayAuthors() {
    const container = document.getElementById("authors-container");
    container.innerHTML = "";

    authorsData.forEach((author) => {
        const authorItem = document.createElement("div");
        authorItem.className = "card shadow-sm card-hover mb-4 text-center";

        authorItem.innerHTML = `
            <div class="card-body">
            <img src="${author.image}" alt="${author.name} avatar" onerror="this.src='../assets/images/default_profile_icon.webp'" class="author-img">
                <h4>${author.name}</h4>
                <p class="text-muted">${author.courseInfo}</p>
                <p class="text-muted">${author.role} | <a href="mailto:${author.contact}">${author.contact}</a></p>
                <p>${author.bio}</p>
            </div>
        `;

        container.appendChild(authorItem);
    });
}

loadAuthors();