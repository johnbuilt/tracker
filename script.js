const nutrientOptions = {
    "Fox Farms Trio": ["Big Bloom", "Grow Big", "Tiger Bloom"],
    "General Hydroponics": ["FloraGro", "FloraBloom", "FloraMicro"],
    "Advanced Nutrients": ["Grow", "Micro", "Bloom"],
    "Botanicare": ["Pure Blend Grow", "Pure Blend Bloom", "Liquid Karma"],
    "Dyna-Gro": ["Foliage-Pro", "Bloom", "Pro-TeKt"],
    "Roots Organics": ["Buddha Grow", "Buddha Bloom", "Trinity"]
};

document.getElementById('plant-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const newPlant = {
        name: document.getElementById('plant-name').value,
        date: document.getElementById('plant-date').value,
        growTime: document.getElementById('plant-grow-time').value,
        waterAmount: document.getElementById('plant-water-amount').value,
        wateringFrequency: document.getElementById('plant-watering-frequency').value,
        nutrientBrand: document.getElementById('plant-nutrient-brand').value,
        nutrients: {}
    };

    const selectedNutrients = document.querySelectorAll('.nutrient-checkbox:checked');
    selectedNutrients.forEach(nutrient => {
        const nutrientName = nutrient.value;
        const modifier = document.getElementById(`modifier-${nutrientName}`).value || 100;
        newPlant.nutrients[nutrientName] = modifier;
    });

    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.push(newPlant);
    localStorage.setItem('plants', JSON.stringify(plants));

    renderPlants();
    alert('Plant added successfully!');
});

function updateNutrientOptions() {
    const nutrientBrand = document.getElementById('plant-nutrient-brand').value;
    const nutrientOptionsContainer = document.getElementById('nutrient-options');
    nutrientOptionsContainer.innerHTML = '';

    if (nutrientOptions[nutrientBrand]) {
        nutrientOptions[nutrientBrand].forEach(nutrient => {
            const nutrientOption = document.createElement('div');
            nutrientOption.innerHTML = `
                <label>
                    <input type="checkbox" class="nutrient-checkbox" value="${nutrient}" onchange="toggleModifierInput('${nutrient}')">
                    ${nutrient}
                </label>
                <input type="number" id="modifier-${nutrient}" class="nutrient-modifier" placeholder="${nutrient} Modifier (%)" style="display:none;">
            `;
            nutrientOptionsContainer.appendChild(nutrientOption);
        });
    }
}

function toggleModifierInput(nutrient) {
    const modifierInput = document.getElementById(`modifier-${nutrient}`);
    modifierInput.style.display = modifierInput.style.display === 'none' ? 'block' : 'none';
}

function renderPlants() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plantList = document.getElementById('plants');
    plantList.innerHTML = '';
    plants.forEach((plant, index) => {
        let nutrientInfo = '';
        for (const [nutrient, modifier] of Object.entries(plant.nutrients)) {
            nutrientInfo += `<p>${nutrient} Modifier: ${modifier} %</p>`;
        }

        const plantItem = document.createElement('div');
        plantItem.className = 'plant-item';
        plantItem.innerHTML = `
            <h3>${plant.name} (Planted on: ${plant.date})</h3>
            <p>Grow Time: ${plant.growTime} weeks</p>
            <p>Water Amount: ${plant.waterAmount} fluid oz</p>
            <p>Watering Frequency: ${plant.wateringFrequency} days</p>
            <p>Nutrient Brand: ${plant.nutrientBrand}</p>
            ${nutrientInfo}
            <button onclick="editPlant(${index})">Edit</button>
        `;
        plantList.appendChild(plantItem);
    });
}

function editPlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plant = plants[index];

    let nutrientOptionsHTML = '';
    if (nutrientOptions[plant.nutrientBrand]) {
        nutrientOptions[plant.nutrientBrand].forEach(nutrient => {
            const isChecked = plant.nutrients[nutrient] !== undefined;
            nutrientOptionsHTML += `
                <label>
                    <input type="checkbox" class="nutrient-checkbox" value="${nutrient}" onchange="toggleModifierInput('${nutrient}')" ${isChecked ? 'checked' : ''}>
                    ${nutrient}
                </label>
                <input type="number" id="modifier-${nutrient}" class="nutrient-modifier" placeholder="${nutrient} Modifier (%)" value="${plant.nutrients[nutrient] || 100}" style="display:${isChecked ? 'block' : 'none'};">
            `;
        });
    }

    const editForm = `
        <div id="edit-plant-form" class="modal">
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
            <label for="edit-nutrient-brand">Nutrients:</label>
            <select id="edit-nutrient-brand" required onchange="updateNutrientOptionsEdit('${index}')">
                ${Object.keys(nutrientOptions).map(brand => `
                    <option value="${brand}" ${brand === plant.nutrientBrand ? 'selected' : ''}>${brand}</option>
                `).join('')}
            </select>
            <div id="nutrient-options-edit">${nutrientOptionsHTML}</div>
            <button onclick="savePlant(${index})">Save</button>
            <button onclick="closeEditForm()">Cancel</button>
        </div>
    `;

    const plantList = document.getElementById('plants');
    plantList.innerHTML += editForm;
}

function updateNutrientOptionsEdit(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plant = plants[index];
    const nutrientBrand = document.getElementById('edit-nutrient-brand').value;
    const nutrientOptionsContainer = document.getElementById('nutrient-options-edit');
    nutrientOptionsContainer.innerHTML = '';

    if (nutrientOptions[nutrientBrand]) {
        nutrientOptions[nutrientBrand].forEach(nutrient => {
            const isChecked = plant.nutrients[nutrient] !== undefined;
            nutrientOptionsContainer.innerHTML += `
                <label>
                    <input type="checkbox" class="nutrient-checkbox" value="${nutrient}" onchange="toggleModifierInput('${nutrient}')" ${isChecked ? 'checked' : ''}>
                    ${nutrient}
                </label>
                <input type="number" id="modifier-${nutrient}" class="nutrient-modifier" placeholder="${nutrient} Modifier (%)" value="${plant.nutrients[nutrient] || 100}" style="display:${isChecked ? 'block' : 'none'};">
            `;
        });
    }
}

function savePlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];

    const updatedPlant = {
        name: document.getElementById('edit-plant-name').value,
        date: document.getElementById('edit-plant-date').value,
        growTime: document.getElementById('edit-plant-grow-time').value,
        waterAmount: document.getElementById('edit-water-amount').value,
        wateringFrequency: document.getElementById('edit-watering-frequency').value,
        nutrientBrand: document.getElementById('edit-nutrient-brand').value,
        nutrients: {}
    };

    const selectedNutrients = document.querySelectorAll('.nutrient-checkbox:checked');
    selectedNutrients.forEach(nutrient => {
        const nutrientName = nutrient.value;
        const modifier = document.getElementById(`modifier-${nutrientName}`).value || 100;
        updatedPlant.nutrients[nutrientName] = modifier;
    });

    plants[index] = updatedPlant;
    localStorage.setItem('plants', JSON.stringify(plants));
    closeEditForm();
    renderPlants();
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
}

document.getElementById('save-plants-button').addEventListener('click', function () {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const file = new Blob([JSON.stringify(plants)], {type: 'application/json'});
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = 'plants.json';
    a.click();
});

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
