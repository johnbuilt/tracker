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
    // Function to edit plant details
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
    // Function to import plants from a file
});

document.getElementById('save-plants-button').addEventListener('click', function () {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const blob = new Blob([JSON.stringify(plants, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plants.json';
    link.click();
});

displayPlants();
