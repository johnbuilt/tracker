document.addEventListener("DOMContentLoaded", () => {
    navigate('new-plant');
    loadPlants();

    document.getElementById("new-plant-form").addEventListener("submit", (event) => {
        event.preventDefault();
        addPlant();
    });

    document.getElementById("edit-plant-form").addEventListener("submit", (event) => {
        event.preventDefault();
        savePlant();
    });
});

function navigate(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

function addPlant() {
    const plants = getPlantsFromStorage();
    const plant = {
        id: new Date().getTime(),
        name: document.getElementById("plant-name").value,
        plantingDate: document.getElementById("planting-date").value,
        growTime: document.getElementById("grow-time").value
    };
    plants.push(plant);
    localStorage.setItem("plants", JSON.stringify(plants));
    alert("Plant added successfully!");
    document.getElementById("new-plant-form").reset();
    loadPlants();
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
            <p>Watering Amount: ${plant.wateringAmount || "N/A"} oz</p>
            <p>Watering Frequency: ${plant.wateringFrequency || "N/A"} days</p>
            <p>Nutrient Brand: ${plant.nutrientBrand || "N/A"}</p>
            <p>Nutrients: ${plant.nutrients ? plant.nutrients.join(", ") : "N/A"}</p>
            <button class="edit" onclick="editPlant(${plant.id})">Edit</button>
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
