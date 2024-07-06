document.getElementById('plant-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('plant-name').value;
    const date = document.getElementById('plant-date').value;
    const growTime = document.getElementById('plant-grow-time').value;
    addPlant(name, date, growTime);
    document.getElementById('plant-form').reset();
});

function addPlant(name, date, growTime) {
    const plant = { name, date, growTime };
    let plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.push(plant);
    localStorage.setItem('plants', JSON.stringify(plants));
    displayPlants();
}

function displayPlants() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plantsDiv = document.getElementById('plants');
    plantsDiv.innerHTML = '';
    plants.forEach((plant, index) => {
        const plantDiv = document.createElement('div');
        plantDiv.className = 'plant-item';
        plantDiv.innerHTML = `
            <p>${plant.name} (Planted on: ${plant.date})</p>
            <p>Grow Time: ${plant.growTime} weeks</p>
            <button onclick="editPlant(${index})">Edit</button>
            <button onclick="deletePlant(${index})">Delete</button>
        `;
        plantsDiv.appendChild(plantDiv);
    });
}

function editPlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plant = plants[index];
    document.getElementById('plant-name').value = plant.name;
    document.getElementById('plant-date').value = plant.date;
    document.getElementById('plant-grow-time').value = plant.growTime;
    document.getElementById('plant-form').onsubmit = function (e) {
        e.preventDefault();
        plant.name = document.getElementById('plant-name').value;
        plant.date = document.getElementById('plant-date').value;
        plant.growTime = document.getElementById('plant-grow-time').value;
        plants[index] = plant;
        localStorage.setItem('plants', JSON.stringify(plants));
        document.getElementById('plant-form').reset();
        document.getElementById('plant-form').onsubmit = addPlantSubmitHandler;
        displayPlants();
    };
}

function deletePlant(index) {
    let plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.splice(index, 1);
    localStorage.setItem('plants', JSON.stringify(plants));
    displayPlants();
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('import-plants-button').addEventListener('click', function () {
    document.getElementById('import-plants-file').click();
});

document.getElementById('import-plants-file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const plants = JSON.parse(event.target.result);
        localStorage.setItem('plants', JSON.stringify(plants));
        displayPlants();
    };
    reader.readAsText(file);
});

document.getElementById('save-plants-button').addEventListener('click', function () {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const blob = new Blob([JSON.stringify(plants, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plants.json';
    link.click();
});

function addPlantSubmitHandler(e) {
    e.preventDefault();
    const name = document.getElementById('plant-name').value;
    const date = document.getElementById('plant-date').value;
    const growTime = document.getElementById('plant-grow-time').value;
    addPlant(name, date, growTime);
    document.getElementById('plant-form').reset();
}

document.getElementById('plant-form').onsubmit = addPlantSubmitHandler;

displayPlants();
