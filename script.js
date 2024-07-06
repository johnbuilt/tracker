document.addEventListener("DOMContentLoaded", function() {
    const addPlantForm = document.getElementById("addPlantForm");
    const editPlantForm = document.getElementById("editPlantForm");
    const plantsList = document.getElementById("plantsList");
    const newPlantSection = document.getElementById("new-plant");
    const myPlantsSection = document.getElementById("my-plants");
    const editPlantSection = document.getElementById("edit-plant");

    let plants = [];
    let currentPlantIndex = null;

    addPlantForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const plant = {
            name: event.target.plantName.value,
            plantingDate: event.target.plantingDate.value,
            growTime: event.target.growTime.value,
            wateringAmount: "",
            wateringFrequency: "",
            nutrientBrand: "",
            nutrients: []
        };
        plants.push(plant);
        event.target.reset();
        displayPlants();
        alert("Plant added successfully!");
    });

    editPlantForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const plant = plants[currentPlantIndex];
        plant.name = event.target.editPlantName.value;
        plant.plantingDate = event.target.editPlantingDate.value;
        plant.growTime = event.target.editGrowTime.value;
        plant.wateringAmount = event.target.wateringAmount.value;
        plant.wateringFrequency = event.target.wateringFrequency.value;
        plant.nutrientBrand = event.target.nutrientBrand.value;
        plant.nutrients = Array.from(event.target.nutrient)
            .filter(input => input.checked)
            .map(input => input.value);
        displayPlants();
        alert("Plant updated successfully!");
    });

    function displayPlants() {
        plantsList.innerHTML = "";
        plants.forEach((plant, index) => {
            const plantDiv = document.createElement("div");
            plantDiv.classList.add("plant");
            plantDiv.innerHTML = `
                <h3>${plant.name}</h3>
                <p>Planted on: ${plant.plantingDate}</p>
                <p>Grow Time: ${plant.growTime} weeks</p>
                <p>Watering Amount: ${plant.wateringAmount} oz</p>
                <p>Watering Frequency: ${plant.wateringFrequency} days</p>
                <p>Nutrient Brand: ${plant.nutrientBrand}</p>
                <p>Nutrients: ${plant.nutrients.join(", ")}</p>
                <button class="edit-plant" data-index="${index}">Edit</button>
                <button class="delete-plant" data-index="${index}">Delete</button>
            `;
            plantsList.appendChild(plantDiv);
        });

        document.querySelectorAll(".edit-plant").forEach(button => {
            button.addEventListener("click", function() {
                currentPlantIndex = this.getAttribute("data-index");
                const plant = plants[currentPlantIndex];
                editPlantForm.editPlantName.value = plant.name;
                editPlantForm.editPlantingDate.value = plant.plantingDate;
                editPlantForm.editGrowTime.value = plant.growTime;
                editPlantForm.wateringAmount.value = plant.wateringAmount;
                editPlantForm.wateringFrequency.value = plant.wateringFrequency;
                editPlantForm.nutrientBrand.value = plant.nutrientBrand;
                Array.from(editPlantForm.nutrient).forEach(input => {
                    input.checked = plant.nutrients.includes(input.value);
                });
                switchSection("edit-plant");
            });
        });

        document.querySelectorAll(".delete-plant").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                plants.splice(index, 1);
                displayPlants();
            });
        });
    }

    function switchSection(sectionId) {
        newPlantSection.classList.add("hidden");
        myPlantsSection.classList.add("hidden");
        editPlantSection.classList.add("hidden");
        document.getElementById(sectionId).classList.remove("hidden");
    }

    document.getElementById("nav-new-plant").addEventListener("click", function() {
        switchSection("new-plant");
    });

    document.getElementById("nav-my-plants").addEventListener("click", function() {
        switchSection("my-plants");
        displayPlants();
    });

    document.getElementById("nav-schedule").addEventListener("click", function() {
        switchSection("schedule");
    });

    document.getElementById("nav-settings").addEventListener("click", function() {
        switchSection("settings");
    });

    switchSection("new-plant");
});
