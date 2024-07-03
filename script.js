document.addEventListener('DOMContentLoaded', function () {
    // ... existing code ...

    document.getElementById('confirmOverwrite').addEventListener('click', () => {
        document.getElementById('import').click();
        document.getElementById('confirmDialog').style.display = 'none';
    });

    document.getElementById('confirmAdd').addEventListener('click', () => {
        document.getElementById('import').click();
        document.getElementById('confirmDialog').style.display = 'none';
    });

    document.getElementById('confirmCancel').addEventListener('click', () => {
        document.getElementById('confirmDialog').style.display = 'none';
    });

    // Handle plant form submit
    document.getElementById('plant-form').addEventListener('submit', function (e) {
        e.preventDefault();
        addPlant();
    });

    // Function to add a new plant
    function addPlant() {
        const name = document.getElementById('plant-name').value;
        const date = document.getElementById('plant-date').value;
        const growTime = document.getElementById('plant-grow-time').value;
        const photo = document.getElementById('upload-photo').files[0];
        const plant = {
            name: name,
            date: date,
            growTime: growTime,
            waterAmount: 20, // Default value, can be changed later
            wateringFrequency: 1, // Default value, can be changed later
            bigBloomModifier: 100,
            growBigModifier: 100,
            tigerBloomModifier: 100,
            photo: photo ? URL.createObjectURL(photo) : null,
        };

        plants.push(plant);
        localStorage.setItem('plants', JSON.stringify(plants));
        renderPlants();
    }

    // Function to render plants
    function renderPlants() {
        const plantsContainer = document.getElementById('plants');
        plantsContainer.innerHTML = '';
        plants.forEach((plant, index) => {
            const plantItem = document.createElement('div');
            plantItem.className = 'plant-item';
            plantItem.innerHTML = `
                <h3>${plant.name} (Planted on: ${plant.date})</h3>
                <p>Grow Time: ${plant.growTime} weeks</p>
                <p>Water Amount: ${plant.waterAmount} fluid oz</p>
                <p>Watering Frequency: ${plant.wateringFrequency} days</p>
                <p>Big Bloom Modifier: ${plant.bigBloomModifier} %</p>
                <p>Grow Big Modifier: ${plant.growBigModifier} %</p>
                <p>Tiger Bloom Modifier: ${plant.tigerBloomModifier} %</p>
                <button class="edit-button" data-index="${index}">Edit</button>
            `;
            plantsContainer.appendChild(plantItem);
        });

        // Add event listeners to edit buttons
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                editPlant(index);
            });
        });
    }

    // Function to edit a plant
    function editPlant(index) {
        const plant = plants[index];
        document.getElementById('plant-name').value = plant.name;
        document.getElementById('plant-date').value = plant.date;
        document.getElementById('plant-grow-time').value = plant.growTime;

        // Hide the add button and show update button
        document.getElementById('add-plant-button').style.display = 'none';
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update Plant';
        updateButton.id = 'update-plant-button';
        updateButton.setAttribute('data-index', index);
        document.getElementById('plant-form').appendChild(updateButton);

        // Handle plant update
        updateButton.addEventListener('click', function (e) {
            e.preventDefault();
            const index = this.getAttribute('data-index');
            plants[index].name = document.getElementById('plant-name').value;
            plants[index].date = document.getElementById('plant-date').value;
            plants[index].growTime = document.getElementById('plant-grow-time').value;
            plants[index].photo = document.getElementById('upload-photo').files[0] ? URL.createObjectURL(document.getElementById('upload-photo').files[0]) : plant.photo;

            localStorage.setItem('plants', JSON.stringify(plants));
            renderPlants();

            // Reset form and button states
            document.getElementById('plant-form').reset();
            updateButton.remove();
            document.getElementById('add-plant-button').style.display = 'block';
        });
    }

    // Initial render
    renderPlants();

    // Event listeners for navigation
    document.getElementById('newPlantTab').addEventListener('click', function () {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById('newPlantPage').style.display = 'block';
    });

    document.getElementById('myPlantsTab').addEventListener('click', function () {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById('myPlantsPage').style.display = 'block';
    });

    document.getElementById('scheduleTab').addEventListener('click', function () {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById('schedulePage').style.display = 'block';
    });

    document.getElementById('settingsTab').addEventListener('click', function () {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById('settingsPage').style.display = 'block';
    });
});
