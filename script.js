// script.js

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const addPlantButton = document.getElementById('nav-add-plant');
    const myPlantsButton = document.getElementById('nav-my-plants');
    const homeButton = document.getElementById('nav-home');
    const scheduleButton = document.getElementById('nav-schedule');
    const settingsButton = document.getElementById('nav-settings');
    
    // Load Home Screen by default
    loadHomeScreen();

    // Navigation Event Listeners
    addPlantButton.addEventListener('click', loadAddPlantScreen);
    myPlantsButton.addEventListener('click', loadMyPlantsScreen);
    homeButton.addEventListener('click', loadHomeScreen);
    scheduleButton.addEventListener('click', loadScheduleScreen);
    settingsButton.addEventListener('click', loadSettingsScreen);

    function loadHomeScreen() {
        mainContainer.innerHTML = `
            <h2>Today's Feedings:</h2>
            <div id="feedings"></div>
        `;
        displayFeedings();
    }

    function loadAddPlantScreen() {
        mainContainer.innerHTML = `
            <h2>Add Plant</h2>
            <form id="add-plant-form">
                <label for="plant-name">Name:</label>
                <input type="text" id="plant-name" name="plant-name">
                <label for="grow-time">Grow Time:</label>
                <input type="number" id="grow-time" name="grow-time">
                <label for="date-planted">Date Planted:</label>
                <input type="date" id="date-planted" name="date-planted">
                <button type="submit">Add Plant</button>
            </form>
            <p id="confirmation-message" style="display: none;">Plant added successfully!</p>
        `;

        document.getElementById('add-plant-form').addEventListener('submit', addPlant);
    }

    function loadMyPlantsScreen() {
        mainContainer.innerHTML = `
            <h2>My Plants</h2>
            <div class="button-container">
                <button id="save-plants" class="center">Save</button>
                <button id="import-plants" class="center">Import</button>
            </div>
            <div id="plants"></div>
        `;

        document.getElementById('save-plants').addEventListener('click', savePlants);
        document.getElementById('import-plants').addEventListener('click', importPlants);
        displayPlants();
    }

    function loadScheduleScreen() {
        mainContainer.innerHTML = '<h2>Schedule</h2><div id="calendar"></div>';
        initializeCalendar();
    }

    function loadSettingsScreen() {
        mainContainer.innerHTML = '<h2>Settings</h2>';
    }

    function addPlant(event) {
        event.preventDefault();
        const plantName = document.getElementById('plant-name').value;
        const growTime = document.getElementById('grow-time').value;
        const datePlanted = document.getElementById('date-planted').value;
        
        const plant = {
            name: plantName,
            growTime: growTime,
            datePlanted: datePlanted,
            wateringAmount: '',
            wateringFrequency: '',
            nutrientBrand: '',
            nutrients: []
        };

        let plants = JSON.parse(localStorage.getItem('plants')) || [];
        plants.push(plant);
        localStorage.setItem('plants', JSON.stringify(plants));

        const confirmationMessage = document.getElementById('confirmation-message');
        confirmationMessage.style.display = 'block';
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000);

        document.getElementById('add-plant-form').reset();
    }

    function displayPlants() {
        let plants = JSON.parse(localStorage.getItem('plants')) || [];
        const plantsContainer = document.getElementById('plants');
        plantsContainer.innerHTML = '';

        plants.forEach((plant, index) => {
            const plantCard = document.createElement('div');
            plantCard.className = 'card';
            plantCard.innerHTML = `
                <p><strong>Name:</strong> ${plant.name}</p>
                <p><strong>Grow Time:</strong> ${plant.growTime} weeks</p>
                <p><strong>Date Planted:</strong> ${plant.datePlanted}</p>
                <p><strong>Watering:</strong> ${plant.wateringAmount} oz every ${plant.wateringFrequency} days</p>
                <p><strong>Nutrients:</strong> ${plant.nutrients.join(', ')}</p>
                <button class="edit-plant" data-index="${index}">Edit</button>
            `;
            plantsContainer.appendChild(plantCard);
        });

        document.querySelectorAll('.edit-plant').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                editPlant(index);
            });
        });
    }

    function displayFeedings() {
        let plants = JSON.parse(localStorage.getItem('plants')) || [];
        const feedingsContainer = document.getElementById('feedings');
        feedingsContainer.innerHTML = '';

        plants.forEach((plant) => {
            const feedingCard = document.createElement('div');
            feedingCard.className = 'card';
            feedingCard.innerHTML = `
                <p><strong>Plant Name:</strong> ${plant.name}</p>
                <p><strong>Water Amount:</strong> ${plant.wateringAmount} oz</p>
                <p><strong>Nutrients:</strong> ${plant.nutrients.join(', ')}</p>
            `;
            feedingsContainer.appendChild(feedingCard);
        });
    }

    function editPlant(index) {
        let plants = JSON.parse(localStorage.getItem('plants')) || [];
        const plant = plants[index];

        mainContainer.innerHTML = `
            <h2>Edit Plant</h2>
            <form id="edit-plant-form">
                <label for="edit-plant-name">Name:</label>
                <input type="text" id="edit-plant-name" name="edit-plant-name" value="${plant.name}">
                <label for="edit-grow-time">Grow Time:</label>
                <input type="number" id="edit-grow-time" name="edit-grow-time" value="${plant.growTime}">
                <label for="edit-date-planted">Date Planted:</label>
                <input type="date" id="edit-date-planted" name="edit-date-planted" value="${plant.datePlanted}">
                <label for="edit-watering-amount">Watering Amount (oz):</label>
                <input type="number" id="edit-watering-amount" name="edit-watering-amount" value="${plant.wateringAmount}">
                <label for="edit-watering-frequency">Watering Frequency (days):</label>
                <input type="number" id="edit-watering-frequency" name="edit-watering-frequency" value="${plant.wateringFrequency}">
                <label for="edit-nutrient-brand">Nutrient Brand:</label>
                <select id="edit-nutrient-brand" name="edit-nutrient-brand">
                    <option value="Fox Farms" ${plant.nutrientBrand === 'Fox Farms' ? 'selected' : ''}>Fox Farms</option>
                    <!-- Add more options as needed -->
                </select>
                <label for="edit-nutrients">Nutrients:</label>
                <div id="edit-nutrients">
                    <label><input type="checkbox" name="nutrients" value="Big Bloom" ${plant.nutrients.includes('Big Bloom') ? 'checked' : ''}> Big Bloom</label>
                    <label><input type="checkbox" name="nutrients" value="Grow Big" ${plant.nutrients.includes('Grow Big') ? 'checked' : ''}> Grow Big</label>
                    <label><input type="checkbox" name="nutrients" value="Tiger Bloom" ${plant.nutrients.includes('Tiger Bloom') ? 'checked' : ''}> Tiger Bloom</label>
                    <!-- Add more checkboxes as needed -->
                </div>
                <button type="submit">Save</button>
            </form>
        `;

        document.getElementById('edit-plant-form').addEventListener('submit', (event) => {
            event.preventDefault();
            plant.name = document.getElementById('edit-plant-name').value;
            plant.growTime = document.getElementById('edit-grow-time').value;
            plant.datePlanted = document.getElementById('edit-date-planted').value;
            plant.wateringAmount = document.getElementById('edit-watering-amount').value;
            plant.wateringFrequency = document.getElementById('edit-watering-frequency').value;
            plant.nutrientBrand = document.getElementById('edit-nutrient-brand').value;

            const nutrients = Array.from(document.querySelectorAll('input[name="nutrients"]:checked')).map(checkbox => checkbox.value);
            plant.nutrients = nutrients;

            plants[index] = plant;
            localStorage.setItem('plants', JSON.stringify(plants));
            loadMyPlantsScreen();
        });
    }

    function savePlants() {
        // Save plants data to a file or cloud storage
        alert('Plants data saved.');
    }

    function importPlants() {
        // Import plants data from a file or cloud storage
        alert('Plants data imported.');
    }

    function initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: getCalendarEvents(),
        });
        calendar.render();
    }

    function getCalendarEvents() {
        let plants = JSON.parse(localStorage.getItem('plants')) || [];
        let events = [];

        plants.forEach(plant => {
            if (plant.wateringFrequency) {
                let datePlanted = new Date(plant.datePlanted);
                let frequency = parseInt(plant.wateringFrequency);

                for (let i = 0; i < plant.growTime * 7; i += frequency) {
                    let wateringDate = new Date(datePlanted);
                    wateringDate.setDate(wateringDate.getDate() + i);
                    events.push({
                        title: `Water ${plant.name}`,
                        start: wateringDate.toISOString().split('T')[0],
                    });
                }
            }
        });

        return events;
    }
});
