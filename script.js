let plants = [];
let editingPlantIndex = null;

function addPlant() {
    const name = document.getElementById("plant-name").value;
    const date = document.getElementById("plant-date").value;
    const growTime = document.getElementById("grow-time").value;

    if (name && date && growTime) {
        plants.push({ name, date, growTime });
        alert("Plant added successfully!");
        document.getElementById("plant-name").value = "";
        document.getElementById("plant-date").value = "";
        document.getElementById("grow-time").value = "";
        displayPlants();
    } else {
        alert("Please fill all fields.");
    }
}

function displayPlants() {
    const plantsList = document.getElementById("plants-list");
    plantsList.innerHTML = "";
    plants.forEach((plant, index) => {
        const plantDiv = document.createElement("div");
        plantDiv.className = "plant";
        plantDiv.innerHTML = `
            <p>${plant.name} (Planted on: ${plant.date})</p>
            <p>Grow Time: ${plant.growTime} weeks</p>
            <button onclick="editPlant(${index})">Edit</button>
            <button onclick="deletePlant(${index})">Delete</button>
        `;
        plantsList.appendChild(plantDiv);
    });
}

function editPlant(index) {
    editingPlantIndex = index;
    const plant = plants[index];
    document.getElementById("edit-plant-name").value = plant.name;
    document.getElementById("edit-plant-date").value = plant.date;
    document.getElementById("edit-grow-time").value = plant.growTime;
    document.getElementById("edit-watering-amount").value = plant.wateringAmount || '';
    document.getElementById("edit-watering-frequency").value = plant.wateringFrequency || '';
    document.getElementById("edit-nutrient-brand").value = plant.nutrientBrand || '';
    showSection('edit-plant');
}

function savePlant() {
    const name = document.getElementById("edit-plant-name").value;
    const date = document.getElementById("edit-plant-date").value;
    const growTime = document.getElementById("edit-grow-time").value;
    const wateringAmount = document.getElementById("edit-watering-amount").value;
    const wateringFrequency = document.getElementById("edit-watering-frequency").value;
    const nutrientBrand = document.getElementById("edit-nutrient-brand").value;

    if (name && date && growTime && wateringAmount && wateringFrequency && nutrientBrand) {
        plants[editingPlantIndex] = { name, date, growTime, wateringAmount, wateringFrequency, nutrientBrand };
        alert("Plant updated successfully!");
        showSection('my-plants');
        displayPlants();
    } else {
        alert("Please fill all fields.");
    }
}

function deletePlant(index) {
    if (confirm("Are you sure you want to delete this plant?")) {
        plants.splice(index, 1);
        displayPlants();
    }
}

function showSection(sectionId) {
    document.querySelectorAll("main > section").forEach(section => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}

function updateNutrients() {
    const brand = document.getElementById("edit-nutrient-brand").value;
    const nutrientsDiv = document.getElementById("edit-nutrients");
    nutrientsDiv.innerHTML = "";

    if (brand === "Fox Farms") {
        ["Big Bloom", "Grow Big", "Tiger Bloom"].forEach(nutrient => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = nutrient;
            nutrientsDiv.appendChild(checkbox);
            nutrientsDiv.appendChild(document.createTextNode(nutrient));
            nutrientsDiv.appendChild(document.createElement("br"));
        });
    }
}
