document.addEventListener("DOMContentLoaded", function () {
    const newPlantSection = document.getElementById("new-plant");
    const myPlantsSection = document.getElementById("my-plants");
    const scheduleSection = document.getElementById("schedule");
    const settingsSection = document.getElementById("settings");

    function showSection(section) {
        newPlantSection.style.display = "none";
        myPlantsSection.style.display = "none";
        scheduleSection.style.display = "none";
        settingsSection.style.display = "none";
        section.style.display = "block";
    }

    document.getElementById("new-plant-button").addEventListener("click", function () {
        showSection(newPlantSection);
    });

    document.getElementById("my-plants-button").addEventListener("click", function () {
        showSection(myPlantsSection);
        renderPlants();
    });

    document.getElementById("schedule-button").addEventListener("click", function () {
        showSection(scheduleSection);
    });

    document.getElementById("settings-button").addEventListener("click", function () {
        showSection(settingsSection);
    });

    const plantForm = document.getElementById("plant-form");
    plantForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const plantName = document.getElementById("plant-name").value;
        const plantDate = document.getElementById("plant-date").value;
        const plantGrowTime = document.getElementById("plant-grow-time").value;

        const plant = {
            id: Date.now(),
            name: plantName,
            date: plantDate,
            growTime: plantGrowTime,
            wateringAmount: '',
            wateringFrequency: '',
            nutrientBrand: '',
            nutrients: []
        };

        addPlant(plant);
        plantForm.reset();
        alert("Plant added successfully!");
    });

    const plants = JSON.parse(localStorage.getItem("plants")) || [];

    function addPlant(plant) {
        plants.push(plant);
        localStorage.setItem("plants", JSON.stringify(plants));
        renderPlants();
    }

    function renderPlants() {
        const plantsDiv = document.getElementById("plants");
        plantsDiv.innerHTML = "";
        plants.forEach(plant => {
            const plantDiv = document.createElement("div");
            plantDiv.className = "plant";

            const plantInfo = document.createElement("p");
            plantInfo.innerText = `${plant.name} (Planted on: ${plant.date}) - Grow Time: ${plant.growTime} weeks`;
            plantDiv.appendChild(plantInfo);

            const editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.addEventListener("click", function () {
                showEditForm(plant);
            });
            plantDiv.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", function () {
                deletePlant(plant.id);
            });
            plantDiv.appendChild(deleteButton);

            plantsDiv.appendChild(plantDiv);
        });
    }

    function showEditForm(plant) {
        const editFormDiv = document.createElement("div");
        editFormDiv.className = "plant-edit-form";

        const editForm = document.createElement("form");
        editForm.className = "edit-form";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = plant.name;
        editForm.appendChild(nameInput);

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = plant.date;
        editForm.appendChild(dateInput);

        const growTimeInput = document.createElement("input");
        growTimeInput.type = "number";
        growTimeInput.value = plant.growTime;
        editForm.appendChild(growTimeInput);

        const wateringAmountInput = document.createElement("input");
        wateringAmountInput.type = "number";
        wateringAmountInput.placeholder = "Watering amount (in oz)";
        wateringAmountInput.value = plant.wateringAmount;
        editForm.appendChild(wateringAmountInput);

        const wateringFrequencyInput = document.createElement("input");
        wateringFrequencyInput.type = "number";
        wateringFrequencyInput.placeholder = "Watering frequency (days)";
        wateringFrequencyInput.value = plant.wateringFrequency;
        editForm.appendChild(wateringFrequencyInput);

        const nutrientBrandSelect = document.createElement("select");
        nutrientBrandSelect.innerHTML = `
            <option value="">Select Nutrient Brand</option>
            <option value="Fox Farms">Fox Farms</option>
            <option value="Advanced Nutrients">Advanced Nutrients</option>
            <option value="General Hydroponics">General Hydroponics</option>
        `;
        nutrientBrandSelect.value = plant.nutrientBrand;
        nutrientBrandSelect.addEventListener("change", function () {
            showNutrients(nutrientBrandSelect.value, plant);
        });
        editForm.appendChild(nutrientBrandSelect);

        const nutrientsDiv = document.createElement("div");
        nutrientsDiv.id = "nutrients-div";
        editForm.appendChild(nutrientsDiv);

        const saveButton = document.createElement("button");
        saveButton.type = "submit";
        saveButton.innerText = "Save";
        editForm.appendChild(saveButton);

        editForm.addEventListener("submit", function (event) {
            event.preventDefault();
            plant.name = nameInput.value;
            plant.date = dateInput.value;
            plant.growTime = growTimeInput.value;
            plant.wateringAmount = wateringAmountInput.value;
            plant.wateringFrequency = wateringFrequencyInput.value;
            plant.nutrientBrand = nutrientBrandSelect.value;
            plant.nutrients = Array.from(document.querySelectorAll("#nutrients-div input:checked")).map(input => input.value);
            savePlant(plant);
        });

        editFormDiv.appendChild(editForm);

        const plantsDiv = document.getElementById("plants");
        plantsDiv.innerHTML = "";
        plantsDiv.appendChild(editFormDiv);

        showNutrients(plant.nutrientBrand, plant);
    }

    function showNutrients(brand, plant) {
        const nutrientsDiv = document.getElementById("nutrients-div");
        nutrientsDiv.innerHTML = "";

        let nutrients = [];
        if (brand === "Fox Farms") {
            nutrients = ["Big Bloom", "Tiger Bloom", "Grow Big"];
        } else if (brand === "Advanced Nutrients") {
            nutrients = ["Micro", "Grow", "Bloom"];
        } else if (brand === "General Hydroponics") {
            nutrients = ["FloraMicro", "FloraGro", "FloraBloom"];
        }

        nutrients.forEach(nutrient => {
            const nutrientLabel = document.createElement("label");
            const nutrientCheckbox = document.createElement("input");
            nutrientCheckbox.type = "checkbox";
            nutrientCheckbox.value = nutrient;
            if (plant.nutrients.includes(nutrient)) {
                nutrientCheckbox.checked = true;
            }
            nutrientLabel.appendChild(nutrientCheckbox);
            nutrientLabel.appendChild(document.createTextNode(nutrient));
            nutrientsDiv.appendChild(nutrientLabel);
        });
    }

    function savePlant(updatedPlant) {
        const index = plants.findIndex(plant => plant.id === updatedPlant.id);
        plants[index] = updatedPlant;
        localStorage.setItem("plants", JSON.stringify(plants));
        renderPlants();
    }

    function deletePlant(plantId) {
        const index = plants.findIndex(plant => plant.id === plantId);
        plants.splice(index, 1);
        localStorage.setItem("plants", JSON.stringify(plants));
        renderPlants();
    }

    renderPlants();
});
