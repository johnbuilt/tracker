document.addEventListener('DOMContentLoaded', function () {
    let plants = [];
    const plantForm = document.getElementById('plant-form');
    const plantsList = document.getElementById('plants');
    const importButton = document.getElementById('import');
    const saveButton = document.getElementById('save');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmOverwriteButton = document.getElementById('confirmOverwrite');
    const confirmAddButton = document.getElementById('confirmAdd');
    const confirmCancelButton = document.getElementById('confirmCancel');

    plantForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const plantName = document.getElementById('plant-name').value;
        const plantDate = document.getElementById('plant-date').value;
        const growTime = parseInt(document.getElementById('plant-grow-time').value);
        const waterAmount = 20;
        const wateringFrequency = 1;
        const bigBloomModifier = 100;
        const growBigModifier = 100;
        const tigerBloomModifier = 100;
        const newPlant = {
            name: plantName,
            date: plantDate,
            growTime: growTime,
            waterAmount: waterAmount,
            wateringFrequency: wateringFrequency,
            bigBloomModifier: bigBloomModifier,
            growBigModifier: growBigModifier,
            tigerBloomModifier: tigerBloomModifier,
        };
        plants.push(newPlant);
        updatePlantsList();
        plantForm.reset();
    });

    function updatePlantsList() {
        plantsList.innerHTML = '';
        plants.forEach((plant, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('plant-item');
            listItem.innerHTML = `
                <div class="card">
                    <div class="card-header" id="heading${index}">
                        <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                                ${plant.name} (Planted on: ${plant.date})
                            </button>
                        </h2>
                    </div>

                    <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#plants">
                        <div class="card-body">
                            <p>Grow Time: ${plant.growTime} weeks</p>
                            <p>Water Amount: ${plant.waterAmount} fluid oz</p>
                            <p>Watering Frequency: ${plant.wateringFrequency} days</p>
                            <p>Big Bloom Modifier: ${plant.bigBloomModifier} %</p>
                            <p>Grow Big Modifier: ${plant.growBigModifier} %</p>
                            <p>Tiger Bloom Modifier: ${plant.tigerBloomModifier} %</p>
                            <button class="edit-plant" data-index="${index}">Edit</button>
                        </div>
                    </div>
                </div>
            `;
            plantsList.appendChild(listItem);
        });
        bindEditButtons();
    }

    function bindEditButtons() {
        document.querySelectorAll('.edit-plant').forEach(button => {
            button.addEventListener('click', function () {
                const index = button.getAttribute('data-index');
                editPlant(index);
            });
        });
    }

    function editPlant(index) {
        const plant = plants[index];
        document.getElementById('plant-name').value = plant.name;
        document.getElementById('plant-date').value = plant.date;
        document.getElementById('plant-grow-time').value = plant.growTime;
        plantForm.setAttribute('data-edit-index', index);
        document.getElementById('add-plant-button').textContent = 'Save Plant';
    }

    plantForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const index = plantForm.getAttribute('data-edit-index');
        if (index !== null) {
            const plant = plants[index];
            plant.name = document.getElementById('plant-name').value;
            plant.date = document.getElementById('plant-date').value;
            plant.growTime = parseInt(document.getElementById('plant-grow-time').value);
            updatePlantsList();
            plantForm.removeAttribute('data-edit-index');
            document.getElementById('add-plant-button').textContent = 'Add Plant';
        }
    });

    importButton.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            const importedPlants = JSON.parse(contents);
            showConfirmDialog(importedPlants);
        };
        reader.readAsText(file);
    });

    function showConfirmDialog(importedPlants) {
        confirmDialog.style.display = 'block';
        confirmOverwriteButton.onclick = function () {
            plants = importedPlants;
            updatePlantsList();
            confirmDialog.style.display = 'none';
        };
        confirmAddButton.onclick = function () {
            plants = plants.concat(importedPlants);
            updatePlantsList();
            confirmDialog.style.display = 'none';
        };
        confirmCancelButton.onclick = function () {
            confirmDialog.style.display = 'none';
        };
    }

    saveButton.addEventListener('click', function () {
        const fileContent = JSON.stringify(plants);
        const blob = new Blob([fileContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plants.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    function getTodaysFeedings() {
        const today = new Date().toISOString().split('T')[0];
        const feedings = plants.map(plant => {
            const plantDate = new Date(plant.date);
            const daysSincePlanting = Math.floor((new Date(today) - plantDate) / (1000 * 60 * 60 * 24));
            if (daysSincePlanting % plant.wateringFrequency === 0) {
                return {
                    name: plant.name,
                    waterAmount: plant.waterAmount,
                    bigBloom: (0.94 * (plant.bigBloomModifier / 100)).toFixed(2),
                    growBig: (0.47 * (plant.growBigModifier / 100)).toFixed(2),
                    tigerBloom: (0 * (plant.tigerBloomModifier / 100)).toFixed(2),
                };
            }
            return null;
        }).filter(feeding => feeding !== null);
        return feedings;
    }

    function updateSchedulePage() {
        const schedulePage = document.getElementById('schedulePage');
        const todaysFeedings = getTodaysFeedings();
        if (todaysFeedings.length > 0) {
            schedulePage.innerHTML = '<h2>Today\'s Feedings:</h2>';
            todaysFeedings.forEach(feeding => {
                const feedingItem = document.createElement('div');
                feedingItem.innerHTML = `
                    <h3>${feeding.name}</h3>
                    <p>Water Amount: ${feeding.waterAmount} fluid oz</p>
                    <p>Big Bloom: ${feeding.bigBloom} tsp</p>
                    <p>Grow Big: ${feeding.growBig} tsp</p>
                    <p>Tiger Bloom: ${feeding.tigerBloom} tsp</p>
                `;
                schedulePage.appendChild(feedingItem);
            });
        } else {
            schedulePage.innerHTML = '<h2>No feedings today</h2>';
        }
    }

    document.getElementById('newPlantTab').addEventListener('click', function () {
        document.getElementById('newPlantPage').style.display = 'block';
        document.getElementById('myPlantsPage').style.display = 'none';
        document.getElementById('schedulePage').style.display = 'none';
        document.getElementById('settingsPage').style.display = 'none';
    });

    document.getElementById('myPlantsTab').addEventListener('click', function () {
        document.getElementById('newPlantPage').style.display = 'none';
        document.getElementById('myPlantsPage').style.display = 'block';
        document.getElementById('schedulePage').style.display = 'none';
        document.getElementById('settingsPage').style.display = 'none';
    });

    document.getElementById('scheduleTab').addEventListener('click', function () {
        document.getElementById('newPlantPage').style.display = 'none';
        document.getElementById('myPlantsPage').style.display = 'none';
        document.getElementById('schedulePage').style.display = 'block';
        document.getElementById('settingsPage').style.display = 'none';
        updateSchedulePage();
    });

    document.getElementById('settingsTab').addEventListener('click', function () {
        document.getElementById('newPlantPage').style.display = 'none';
        document.getElementById('myPlantsPage').style.display = 'none';
        document.getElementById('schedulePage').style.display = 'none';
        document.getElementById('settingsPage').style.display = 'block';
    });
});
