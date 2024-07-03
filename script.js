document.getElementById('plant-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const plant = {
        name: document.getElementById('plant-name').value,
        date: document.getElementById('plant-date').value,
        growTime: document.getElementById('plant-grow-time').value,
        waterAmount: 0, // Placeholder for default values
        wateringFrequency: 0, // Placeholder for default values
        nutrientBrand: 'Fox Farms Trio', // Default to Fox Farms Trio
        nutrients: []
    };

    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.push(plant);
    localStorage.setItem('plants', JSON.stringify(plants));

    renderPlants();
    this.reset();
    showPopup('Plant successfully added!');
});

function renderPlants() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plantList = document.getElementById('plants');
    plantList.innerHTML = '';
    plants.forEach((plant, index) => {
        const plantItem = document.createElement('div');
        plantItem.className = 'plant-item';
        plantItem.innerHTML = `
            <h3 onclick="togglePlantDetails(${index})">${plant.name} (Planted on: ${plant.date})</h3>
            <div id="plant-details-${index}" class="plant-details" style="display: none;">
                <p>Grow Time: ${plant.growTime} weeks</p>
                <p>Water Amount: ${plant.waterAmount} fluid oz</p>
                <p>Watering Frequency: ${plant.wateringFrequency} days</p>
                <p>Nutrient Brand: ${plant.nutrientBrand}</p>
                ${plant.nutrients.map(nutrient => `
                    <p>${nutrient.name} Modifier: ${nutrient.modifier} %</p>
                `).join('')}
                <button onclick="editPlant(${index})">Edit</button>
            </div>
        `;
        plantList.appendChild(plantItem);
    });
}

function togglePlantDetails(index) {
    const details = document.getElementById(`plant-details-${index}`);
    if (details.style.display === 'none') {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
}

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
    showPopup('Plants successfully imported!');
}

function savePlantsToFile() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plants));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "plants.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showPopup('Plants successfully saved!');
}

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
        <label for="edit-plant-nutrient-brand">Nutrients:</label>
        <select id="edit-plant-nutrient-brand" required onchange="updateEditNutrientOptions(${index})">
            <option value="Fox Farms Trio" ${plant.nutrientBrand === 'Fox Farms Trio' ? 'selected' : ''}>Fox Farms Trio</option>
            <option value="General Hydroponics" ${plant.nutrientBrand === 'General Hydroponics' ? 'selected' : ''}>General Hydroponics</option>
            <option value="Advanced Nutrients" ${plant.nutrientBrand === 'Advanced Nutrients' ? 'selected' : ''}>Advanced Nutrients</option>
            <option value="Botanicare" ${plant.nutrientBrand === 'Botanicare' ? 'selected' : ''}>Botanicare</option>
            <option value="Dyna-Gro" ${plant.nutrientBrand === 'Dyna-Gro' ? 'selected' : ''}>Dyna-Gro</option>
            <option value="Roots Organics" ${plant.nutrientBrand === 'Roots Organics' ? 'selected' : ''}>Roots Organics</option>
        </select>
        <div id="edit-nutrient-options"></div>
        <button onclick="savePlant(${index})">Save</button>
        <button onclick="closeEditForm()">Cancel</button>
    `;

    const plantList = document.getElementById('plants');
    plantList.appendChild(editForm);

    updateEditNutrientOptions(index, plant.nutrients);
}

function savePlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];

    const updatedPlant = {
        name: document.getElementById('edit-plant-name').value,
        date: document.getElementById('edit-plant-date').value,
        growTime: document.getElementById('edit-plant-grow-time').value,
        waterAmount: document.getElementById('edit-water-amount').value,
        wateringFrequency: document.getElementById('edit-watering-frequency').value,
        nutrientBrand: document.getElementById('edit-plant-nutrient-brand').value,
        nutrients: []
    };

    document.querySelectorAll('#edit-nutrient-options input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            const nutrientName = checkbox.value;
            const modifierValue = document.getElementById(`edit-plant-${nutrientName.toLowerCase().replace(/ /g, '-')}-modifier`).value;
            updatedPlant.nutrients.push({
                name: nutrientName,
                modifier: modifierValue
            });
        }
    });

    plants[index] = updatedPlant;
    localStorage.setItem('plants', JSON.stringify(plants));
    closeEditForm();
    renderPlants();
    showPopup('Plant successfully updated!');
}

function closeEditForm() {
    const editForm = document.getElementById('edit-plant-form');
    if (editForm) {
        editForm.remove();
    }
}

function updateEditNutrientOptions(index, nutrients = []) {
    const brand = document.getElementById('edit-plant-nutrient-brand').value;
    const options = document.getElementById('edit-nutrient-options');
    options.innerHTML = '';

    let nutrientOptions = [];
    if (brand === 'Fox Farms Trio') {
        nutrientOptions = ['Big Bloom', 'Grow Big', 'Tiger Bloom'];
    } else if (brand === 'General Hydroponics') {
        nutrientOptions = ['FloraGro', 'FloraBloom', 'FloraMicro'];
    } else if (brand === 'Advanced Nutrients') {
        nutrientOptions = ['Micro', 'Grow', 'Bloom'];
    } else if (brand === 'Botanicare') {
        nutrientOptions = ['Pure Blend Pro', 'Liquid Karma', 'Cal-Mag Plus'];
    } else if (brand === 'Dyna-Gro') {
        nutrientOptions = ['Foliage-Pro', 'Bloom', 'Protekt'];
    } else if (brand === 'Roots Organics') {
        nutrientOptions = ['Buddha Grow', 'Buddha Bloom', 'Trinity'];
    }

    nutrientOptions.forEach(nutrient => {
        const nutrientOption = document.createElement('div');
        const isChecked = nutrients.find(n => n.name === nutrient);
        nutrientOption.innerHTML = `
            <label>
                <input type="checkbox" value="${nutrient}" ${isChecked ? 'checked' : ''}>
                ${nutrient}
            </label>
            <input type="number" id="edit-plant-${nutrient.toLowerCase().replace(/ /g, '-')}-modifier" placeholder="${nutrient} Modifier (%)" value="${isChecked ? isChecked.modifier : ''}">
        `;
        options.appendChild(nutrientOption);
    });
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    renderPlants();
    document.getElementById('save-plants-button').addEventListener('click', savePlantsToFile);
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
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
});
