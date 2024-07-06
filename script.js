document.addEventListener("DOMContentLoaded", () => {
    navigate("new-plant");
    loadPlants();
});

function navigate(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}

function addPlant() {
    const name = document.getElementById("plant-name").value;
    const plantingDate = document.getElementById("planting-date").value;
    const growTime = document.getElementById("grow-time").value;

    if (name && plantingDate && growTime) {
        const plants = getPlantsFromStorage();
        const newPlant = {
            id: plants.length ? plants[plants.length - 1].id + 1 : 1,
            name,
            plantingDate,
            growTime
        };
        plants.push(newPlant);
        localStorage.setItem("plants", JSON.stringify(plants));
        alert("Plant added successfully!");
        document.getElementById("new-plant-form").reset();
    } else {
        alert("Please fill out all fields.");
    }
}

function loadPlants() {
    const plants = getPlantsFromStorage();
    const plantsList = document.getElementById("plants-list");
    plantsList.innerHTML = "";

    plants.forEach(plant => {
        const plantDiv = document.createElement("div");
        plantDiv.classList.add("plant");
        plantDiv.innerHTML = `
            <p>${plant.name} (Planted on: ${plant.plantingDate})</p>
            <p>Grow Time: ${plant.growTime} weeks</p>
            <button onclick="editPlant(${plant.id})">Edit</button>
            <button onclick="deletePlant(${plant.id})">Delete</button>
        `;
        plantsList.appendChild(plantDiv);
    });
}

function editPlant(id) {
    const plants = getPlantsFromStorage();
    const plant = plants.find(p => p.id === id);

    if (plant) {
        document.getElementById("edit-plant-name").value = plant.name;
        document.getElementById("edit-planting-date").value = plant.plantingDate;
        document.getElementById("edit-grow-time").value = plant.growTime;
        document.getElementById("edit-watering-amount").value = plant.wateringAmount || "";
        document.getElementById("edit-watering-frequency").value = plant.wateringFrequency || "";
        document.getElementById("edit-nutrient-brand").value = plant.nutrientBrand || "";
        document.querySelectorAll("#edit-nutrients input[type=checkbox]").forEach(checkbox => {
            checkbox.checked = plant.nutrients ? plant.nutrients.includes(checkbox.value) : false;
        });
        document.getElementById("edit-plant-form").dataset.id = id;
        navigate('edit-plant');
    }
}

function savePlant() {
    const plants = getPlantsFromStorage();
    const id = parseInt(document.getElementById("edit-plant-form").dataset.id);
    const plant = plants.find(p => p.id === id);

    if (plant) {
        plant.name = document.getElementById("edit-plant-name").value;
        plant.plantingDate = document.getElementById("edit-planting-date").value;
        plant.growTime = document.getElementById("edit-grow-time").value;
        plant.wateringAmount = document.getElementById("edit-watering-amount").value;
        plant.wateringFrequency = document.getElementById("edit-watering-frequency").value;
        plant.nutrientBrand = document.getElementById("edit-nutrient-brand").value;
        plant.nutrients = Array.from(document.querySelectorAll("#edit-nutrients input[type=checkbox]:checked")).map(cb => cb.value);
        localStorage.setItem("plants", JSON.stringify(plants));
        alert("Plant updated successfully!");
        loadPlants();
        navigate('my-plants');
    }
}

function deletePlant(id) {
    let plants = getPlantsFromStorage();
    plants = plants.filter(p => p.id !== id);
    localStorage.setItem("plants", JSON.stringify(plants));
    loadPlants();
}

function getPlantsFromStorage() {
    return JSON.parse(localStorage.getItem("plants")) || [];
}

function importPlants() {
    // Implement import plants functionality here
}

function savePlantsToFile() {
    // Implement save plants to file functionality here
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
    // Add more brands and nutrients as needed
}
