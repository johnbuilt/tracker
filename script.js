document.addEventListener('DOMContentLoaded', function() {
    const plantForm = document.getElementById('plant-form');
    const plantsList = document.getElementById('plants');
    const importButton = document.getElementById('import-plants-button');
    const saveButton = document.getElementById('save-plants-button');
    let plants = JSON.parse(localStorage.getItem('plants')) || [];
    let currentEditingPlantIndex = null;

    function renderPlants() {
        plantsList.innerHTML = '';
        plants.forEach((plant, index) => {
            const plantItem = document.createElement('div');
            plantItem.classList.add('plant-item');
            plantItem.innerHTML = `
                <strong>Name:</strong> ${plant.name} <br>
                <strong>Planting Date:</strong> ${plant.plantingDate} <br>
                <strong>Grow Time:</strong> ${plant.growTime} weeks <br>
                <button class="edit-plant-button" data-index="${index}">Edit</button>
            `;
            plantsList.appendChild(plantItem);
        });
    }

    plantForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('plant-name').value;
        const plantingDate = document.getElementById('plant-date').value;
        const growTime = document.getElementById('plant-grow-time').value;

        if (currentEditingPlantIndex === null) {
            plants.push({ name, plantingDate, growTime });
        } else {
            plants[currentEditingPlantIndex] = { name, plantingDate, growTime };
            currentEditingPlantIndex = null;
        }

        localStorage.setItem('plants', JSON.stringify(plants));
        renderPlants();
        plantForm.reset();
    });

    plantsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-plant-button')) {
            currentEditingPlantIndex = event.target.dataset.index;
            const plant = plants[currentEditingPlantIndex];
            document.getElementById('plant-name').value = plant.name;
            document.getElementById('plant-date').value = plant.plantingDate;
            document.getElementById('plant-grow-time').value = plant.growTime;
        }
    });

    importButton.addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const importedPlants = JSON.parse(e.target.result);
                plants = importedPlants;
                localStorage.setItem('plants', JSON.stringify(plants));
                renderPlants();
            };
            reader.readAsText(file);
        });
        fileInput.click();
    });

    saveButton.addEventListener('click', function() {
        const blob = new Blob([JSON.stringify(plants)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plants.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    renderPlants();
});
