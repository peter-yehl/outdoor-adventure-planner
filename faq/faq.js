let faqData = [];

// Load FAQ data from JSON file and display it
async function loadFAQ() {
    const response = await fetch("../data/faq.json");
    faqData = await response.json();
    displayFAQ();
}

// Display FAQ items in the accordion
function displayFAQ() {
    const container = document.getElementById("faqAccordion");
    container.innerHTML = "";

    // Create accordion items for each FAQ entry
    faqData.forEach((item, index) => {
        const faqItem = document.createElement("div");
        faqItem.className = "accordion-item";

        // Set up the accordion item structure with question and answer
        faqItem.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button ${index !== 0 ? "collapsed" : ""}" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq${index}">
                    ${item.question}
                </button>
            </h2>

            <div id="faq${index}" 
                 class="accordion-collapse collapse ${index === 0 ? "show" : ""}" 
                 data-bs-parent="#faqAccordion">

                <div class="accordion-body"><strong>
                    ${item.answer}
                </strong><br></div>
            </div>
        `;

        container.appendChild(faqItem);
    });
}

loadFAQ();