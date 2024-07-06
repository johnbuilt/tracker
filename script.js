document.addEventListener('DOMContentLoaded', () => {
    const plantForm = document.getElementById('plant-form');
    const editPlantForm = document.getElementById('edit-plant-form');
    const plantsList = document.getElementById('plants-list');
    let plants = JSON.parse(localStorage.getItem('plants')) || [];
    let editPlantIndex = null;

    plantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = plantForm['plant-name'].value;
        const date = plantForm['plant-date'].value;
        const time = plantForm['plant-time'].value;

        plants.push({ name, date, time });
        localStorage.setItem('plants', JSON.stringify(plants));
        plantForm.reset();
        alert('Plant added successfully!');
        displayPlants();
    });

    editPlantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = editPlantForm['edit-plant-name'].value;
        const date = editPlantForm['edit-plant-date'].value;
        const time = editPlantForm['edit-plant-time'].value;
        const wateringAmount = editPlantForm['edit-watering-amount'].value;
        const wateringFrequency = editPlantForm['edit-watering-frequency'].value;
        const nutrientBrand = editPlantForm['edit-nutrient-brand'].value;
        const nutrients = Array.from(editPlantForm['nutrients'])
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        plants[editPlantIndex] = { name, date, time, wateringAmount, wateringFrequency, nutrientBrand, nutrients };
        localStorage.setItem('plants', JSON.stringify(plants));
        editPlantForm.reset();
        alert('Plant updated successfully!');
        displayPlants();
        showSection('my-plants');
    });

    function displayPlants() {
        plantsList.innerHTML = '';
        plants.forEach((plant, index) => {
            const plantDiv = document.createElement('div');
            plantDiv.className = 'plant';
            plantDiv.innerHTML = `
                <h3>${plant.name}</h3>
                <p>Planted on: ${plant.date}</p>
                <p>Grow Time: ${plant.time} weeks</p>
                <p>Watering Amount: ${plant.wateringAmount || 'N/A'} oz</p>
                <p>Watering Frequency: ${plant.wateringFrequency || 'N/A'} days</p>
                <p>Nutrient Brand: ${plant.nutrientBrand || 'N/A'}</p>
                <p>Nutrients: ${plant.nutrients ? plant.nutrients.join(', ') : 'N/A'}</p>
                <button onclick="editPlant(${index})">Edit</button>
                <button onclick="deletePlant(${index})">Delete</button>
            `;
            plantsList.appendChild(plantDiv);
        });
    }

    function editPlant(index) {
        const plant = plants[index];
        editPlantIndex = index;
        editPlantForm['edit-plant-name'].value = plant.name;
        editPlantForm['edit-plant-date'].value = plant.date;
        editPlantForm['edit-plant-time'].value = plant.time;
        editPlantForm['edit-watering-amount'].value = plant.wateringAmount || '';
        editPlantForm['edit-watering-frequency'].value = plant.wateringFrequency || '';
        editPlantForm['edit-nutrient-brand'].value = plant.nutrientBrand || '';
        Array.from(editPlantForm['nutrients']).forEach(checkbox => {
            checkbox.checked = plant.nutrients ? plant.nutrients.includes(checkbox.value) : false;
        });
        showSection('edit-plant');
    }

    function deletePlant(index) {
        plants.splice(index, 1);
        localStorage.setItem('plants', JSON.stringify(plants));
        displayPlants();
    }

    function showSection(sectionId) {
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    }

    function importPlants() {
        // Add import plants functionality here
    }

    function savePlants() {
        // Add save plants to file functionality here
    }

    displayPlants();
    showSection('new-plant');
});
