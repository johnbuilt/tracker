document.addEventListener("DOMContentLoaded", function () {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    const plantForm = document.getElementById("plant-form");
    const plantNameInput = document.getElementById("plant-name");
    const plantDateInput = document.getElementById("plant-date");
    const plantGrowTimeInput = document.getElementById("plant-grow-time");
    const plantsDiv = document.getElementById("plants");

    function displayPlants() {
        plantsDiv.innerHTML = "";
        plants.forEach((plant, index) => {
            const plantItem = document.createElement("div");
            plantItem.classList.add("plant-item");
            plantItem.innerHTML = `
                <p>${plant.name} (Planted on: ${plant.date})</p>
                <p>Grow Time: ${plant.growTime} weeks</p>
                <button onclick="editPlant(${index})">Edit</button>
                <button onclick="deletePlant(${index})">Delete</button>
            `;
            plantsDiv.appendChild(plantItem);
        });
    }

    function addPlant(e) {
        e.preventDefault();
        const newPlant = {
            name: plantNameInput.value,
            date: plantDateInput.value,
            growTime: plantGrowTimeInput.value
        };
        plants.push(newPlant);
        localStorage.setItem("plants", JSON.stringify(plants));
        displayPlants();
        plantForm.reset();
        alert("Plant added successfully!");
    }

    plantForm.addEventListener("submit", addPlant);

    window.editPlant = function (index) {
        const plant = plants[index];
        plantNameInput.value = plant.name;
        plantDateInput.value = plant.date;
        plantGrowTimeInput.value = plant.growTime;
        plants.splice(index, 1);
        displayPlants();
    };

    window.deletePlant = function (index) {
        plants.splice(index, 1);
        localStorage.setItem("plants", JSON.stringify(plants));
        displayPlants();
    };

    displayPlants();
});
