document.addEventListener("DOMContentLoaded", function () {
    navigateTo('new-plant'); // Set default page
});

function navigateTo(page) {
    window.location.hash = page;
    renderPage(page);
}

function renderPage(page) {
    const content = document.getElementById("content");
    if (page === 'new-plant') {
        content.innerHTML = `
            <h2>Add New Plant</h2>
            <form id="newPlantForm">
                <label>Plant Name: <input type="text" id="plantName"></label><br>
                <label>Planting Date: <input type="date" id="plantDate"></label><br>
                <label>Grow Time (weeks): <input type="number" id="growTime"></label><br>
                <button type="button" onclick="addPlant()">Add Plant</button>
            </form>
        `;
    } else if (page === 'my-plants') {
        renderMyPlants();
    } else if (page === 'schedule') {
        content.innerHTML = `<h2>Schedule</h2><p>Schedule page content goes here.</p>`;
    } else if (page === 'settings') {
        content.innerHTML = `<h2>Settings</h2><p>Settings page content goes here.</p>`;
    }
}

function addPlant() {
    const name = document.getElementById("plantName").value;
    const date = document.getElementById("plantDate").value;
    const time = document.getElementById("growTime").value;

    if (name && date && time) {
        const plants = JSON.parse(localStorage.getItem("plants")) || [];
        plants.push({ name, date, time });
        localStorage.setItem("plants", JSON.stringify(plants));
        alert("Plant added successfully!");
        document.getElementById("newPlantForm").reset();
    } else {
        alert("Please fill out all fields.");
    }
}

function renderMyPlants() {
    const content = document.getElementById("content");
    const plants = JSON.parse(localStorage.getItem("plants")) || [];
    content.innerHTML = `
        <h2>My Plants</h2>
        <button onclick="importPlants()">Import Plants</button>
        <button onclick="savePlants()">Save Plants to File</button>
        <div id="plantsList">
            ${plants.map((plant, index) => `
                <div class="plant">
                    <p>${index + 1} (Planted on: ${plant.date})</p>
                    <p>Grow Time: ${plant.time} weeks</p>
                    <button onclick="editPlant(${index})">Edit</button>
                    <button onclick="deletePlant(${index})">Delete</button>
                </div>
            `).join('')}
        </div>
    `;
}

function editPlant(index) {
    const plants = JSON.parse(localStorage.getItem("plants")) || [];
    const plant = plants[index];
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Edit Plant</h2>
        <form id="editPlantForm">
            <label>Plant Name: <input type="text" id="editPlantName" value="${plant.name}"></label><br>
            <label>Planting Date: <input type="date" id="editPlantDate" value="${plant.date}"></label><br>
            <label>Grow Time (weeks): <input type="number" id="editGrowTime" value="${plant.time}"></label><br>
            <label>Watering Amount (oz): <input type="number" id="editWateringAmount" value="${plant.wateringAmount || ''}"></label><br>
            <label>Watering Frequency (days): <input type="number" id="editWateringFrequency" value="${plant.wateringFrequency || ''}"></label><br>
            <label>Nutrient Brand: 
                <select id="editNutrientBrand" onchange="updateNutrientOptions()">
                    <option value="">Select Brand</option>
                    <option value="Fox Farms" ${plant.nutrientBrand === 'Fox Farms' ? 'selected' : ''}>Fox Farms</option>
                    <option value="General Hydroponics" ${plant.nutrientBrand === 'General Hydroponics' ? 'selected' : ''}>General Hydroponics</option>
                    <option value="Advanced Nutrients" ${plant.nutrientBrand === 'Advanced Nutrients' ? 'selected' : ''}>Advanced Nutrients</option>
                </select>
            </label><br>
            <div id="nutrientOptions">
                <!-- Nutrient options will be rendered here -->
            </div>
            <button type="button" onclick="savePlant(${index})">Save</button>
        </form>
    `;
    updateNutrientOptions(plant.nutrients || []);
}

function savePlant(index) {
    const plants = JSON.parse(localStorage.getItem("plants")) || [];
    const plant = plants[index];
    plant.name = document.getElementById("editPlantName").value;
    plant.date = document.getElementById("editPlantDate").value;
    plant.time = document.getElementById("editGrowTime").value;
    plant.wateringAmount = document.getElementById("editWateringAmount").value;
    plant.wateringFrequency = document.getElementById("editWateringFrequency").value;
    plant.nutrientBrand = document.getElementById("editNutrientBrand").value;
    plant.nutrients = Array.from(document.querySelectorAll('#nutrientOptions input:checked')).map(input => input.value);
    localStorage.setItem("plants", JSON.stringify(plants));
    alert("Plant updated successfully!");
    renderMyPlants();
}

function updateNutrientOptions(selectedNutrients = []) {
    const brand = document.getElementById("editNutrientBrand").value;
    const options = {
        "Fox Farms": ["Big Bloom", "Grow Big", "Tiger Bloom"],
        "General Hydroponics": ["FloraGro", "FloraBloom", "FloraMicro"],
        "Advanced Nutrients": ["Grow", "Micro", "Bloom"]
    };
    const nutrients = options[brand] || [];
    const nutrientOptionsDiv = document.getElementById("nutrientOptions");
    nutrientOptionsDiv.innerHTML = `
        <label>Nutrients:</label><br>
        ${nutrients.map(nutrient => `
            <label><input type="checkbox" value="${nutrient}" ${selectedNutrients.includes(nutrient) ? 'checked' : ''}> ${nutrient}</label><br>
        `).join('')}
    `;
}

function deletePlant(index) {
    const plants = JSON.parse(localStorage.getItem("plants")) || [];
    plants.splice(index, 1);
    localStorage.setItem("plants", JSON.stringify(plants));
    renderMyPlants();
}

function importPlants() {
    // Implement import functionality
}

function savePlants() {
    // Implement save functionality
}
