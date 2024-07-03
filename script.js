document.addEventListener('DOMContentLoaded', function () {
    navigateTo('new-plant');
});

function navigateTo(page) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    switch (page) {
        case 'new-plant':
            contentDiv.innerHTML = `
                <form id="plant-form">
                    <label for="plant-name">Plant Name:</label>
                    <input type="text" id="plant-name" required>
                    <label for="plant-date">Planting Date:</label>
                    <input type="date" id="plant-date" required>
                    <label for="plant-grow-time">Grow Time (weeks):</label>
                    <input type="number" id="plant-grow-time" required>
                    <label for="plant-photo">Upload Photo:</label>
                    <input type="file" id="plant-photo" accept="image/*">
                    <button type="submit">Add Plant</button>
                </form>
            `;
            document.getElementById('plant-form').addEventListener('submit', addPlant);
            break;

        case 'my-plants':
            contentDiv.innerHTML = `
                <button onclick="importPlants()">Import Plants</button>
                <button onclick="savePlants()">Save Plants to File</button>
                <ul id="plants"></ul>
            `;
            displayPlants();
            break;

        case 'schedule':
            contentDiv.innerHTML = `
                <div>Schedule</div>
            `;
            break;

        case 'settings':
            contentDiv.innerHTML = `
                <div>Settings</div>
            `;
            break;
    }
}

let plants = [];

function addPlant(event) {
    event.preventDefault();

    const plantName = document.getElementById('plant-name').value;
    const plantDate = document.getElementById('plant-date').value;
    const plantGrowTime = document.getElementById('plant-grow-time').value;
    const plantPhoto = document.getElementById('plant-photo').files[0];

    const plant = {
        name: plantName,
        date: plantDate,
        growTime: plantGrowTime,
        photo: plantPhoto ? URL.createObjectURL(plantPhoto) : null,
    };

    plants.push(plant);
    savePlants();
    navigateTo('my-plants');
}

function displayPlants() {
    const plantsList = document.getElementById('plants');
    plantsList.innerHTML = '';

    plants.forEach((plant, index) => {
        const li = document.createElement('li');
        li.classList.add('plant-item');
        li.innerHTML = `
            <div>
                <strong>${plant.name}</strong> (Planted on: ${plant.date})
                <div>Grow Time: ${plant.growTime} weeks</div>
                ${plant.photo ? `<img src="${plant.photo}" alt="${plant.name}" style="max-width: 100px;">` : ''}
            </div>
        `;
        plantsList.appendChild(li);
    });
}

function savePlants() {
    const data = JSON.stringify(plants);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plants.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importPlants() {
    const confirmDiv = document.createElement('div');
    confirmDiv.innerHTML = `
        <div class="confirm-dialog">
            <p>Do you want to add to existing plants or overwrite them?</p>
            <button onclick="handleImportChoice('add')">Add</button>
            <button onclick="handleImportChoice('overwrite')">Overwrite</button>
        </div>
    `;
    document.body.appendChild(confirmDiv);
}

function handleImportChoice(choice) {
    document.querySelector('.confirm-dialog').remove();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', function () {
        handleFiles(choice, this.files[0]);
    }, false);
    input.click();
}

function handleFiles(choice, file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const importedPlants = JSON.parse(event.target.result);
        if (choice === 'add') {
            plants = plants.concat(importedPlants);
        } else if (choice === 'overwrite') {
            plants = importedPlants;
        }
        displayPlants();
    };
    reader.readAsText(file);
}
