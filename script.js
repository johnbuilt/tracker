document.getElementById('plant-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const newPlant = {
        name: document.getElementById('plant-name').value,
        date: document.getElementById('plant-date').value,
        growTime: document.getElementById('plant-grow-time').value,
        waterAmount: document.getElementById('plant-water-amount').value,
        wateringFrequency: document.getElementById('plant-watering-frequency').value,
        bigBloomModifier: document.getElementById('plant-big-bloom-modifier').value || 100,
        growBigModifier: document.getElementById('plant-grow-big-modifier').value || 100,
        tigerBloomModifier: document.getElementById('plant-tiger-bloom-modifier').value || 100,
    };

    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.push(newPlant);
    localStorage.setItem('plants', JSON.stringify(plants));

    renderPlants();
    alert('Plant added successfully!');
});


document.getElementById('import-plants-button').addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = JSON.parse(e.target.result);
                const addOrOverwrite = confirm("Do you want to add to existing plants? Click 'Cancel' to overwrite.");
                if (addOrOverwrite) {
                    importPlants(data, true);
                } else {
                    importPlants(data, false);
                }
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
});

function importPlants(plants, add) {
    if (!add) {
        localStorage.setItem('plants', JSON.stringify(plants));
    } else {
        const existingPlants = JSON.parse(localStorage.getItem('plants')) || [];
        const newPlants = existingPlants.concat(plants);
        localStorage.setItem('plants', JSON.stringify(newPlants));
    }
    renderPlants();
}

function renderPlants() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plantList = document.getElementById('plants');
    plantList.innerHTML = '';
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
            <button onclick="editPlant(${index})">Edit</button>
        `;
        plantList.appendChild(plantItem);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderPlants();
});

document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('.navbar a').forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');

        const sections = ['new-plant', 'my-plants', 'schedule', 'settings'];
        sections.forEach(section => {
            document.getElementById(section).style.display = 'none';
        });

        const targetSection = link.getAttribute('href').substring(1);
        document.getElementById(targetSection).style.display = 'block';
    });
});

function editPlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plant = plants[index];

    const editForm = document.createElement('div');
    editForm.id = 'edit-plant-form';
    editForm.innerHTML = `
        <label for="edit-plant-name">Plant Name:</label>
        <input type="text" id="edit-plant-name" value="${plant.name}" required>
        <label for="edit-plant-date">Planting Date:</label>
        <input type="date" id="edit-plant-date" value="${plant.date}" required>
        <label for="edit-plant-grow-time">Grow Time (weeks):</label>
        <input type="number" id="edit-plant-grow-time" value="${plant.growTime}" required>
        <label for="edit-water-amount">Water Amount (fluid oz):</label>
        <input type="number" id="edit-water-amount" value="${plant.waterAmount}" required>
        <label for="edit-watering-frequency">Watering Frequency (days):</label>
        <input type="number" id="edit-watering-frequency" value="${plant.wateringFrequency}" required>
        <label for="edit-big-bloom-modifier">Big Bloom Modifier (%):</label>
        <input type="number" id="edit-big-bloom-modifier" value="${plant.bigBloomModifier}" required>
        <label for="edit-grow-big-modifier">Grow Big Modifier (%):</label>
        <input type="number" id="edit-grow-big-modifier" value="${plant.growBigModifier}" required>
        <label for="edit-tiger-bloom-modifier">Tiger Bloom Modifier (%):</label>
        <input type="number" id="edit-tiger-bloom-modifier" value="${plant.tigerBloomModifier}" required>
        <button onclick="savePlant(${index})">Save</button>
        <button onclick="closeEditForm()">Cancel</button>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = closeEditForm;

    document.body.appendChild(overlay);
    document.body.appendChild(editForm);
}

function savePlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];

    const updatedPlant = {
        name: document.getElementById('edit-plant-name').value,
        date: document.getElementById('edit-plant-date').value,
        growTime: document.getElementById('edit-plant-grow-time').value,
        waterAmount: document.getElementById('edit-water-amount').value,
        wateringFrequency: document.getElementById('edit-watering-frequency').value,
        bigBloomModifier: document.getElementById('edit-big-bloom-modifier').value,
        growBigModifier: document.getElementById('edit-grow-big-modifier').value,
        tigerBloomModifier: document.getElementById('edit-tiger-bloom-modifier').value
    };

    plants[index] = updatedPlant;
    localStorage.setItem('plants', JSON.stringify(plants));
    closeEditForm();
    renderPlants();
}

function closeEditForm() {
    const editForm = document.getElementById('edit-plant-form');
    const overlay = document.querySelector('.overlay');
    if (editForm) {
        editForm.remove();
    }
    if (overlay) {
        overlay.remove();
    }
}

document.getElementById('save-plants-button').addEventListener('click', function () {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const fileName = 'plants.json';
    const json = JSON.stringify(plants, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
