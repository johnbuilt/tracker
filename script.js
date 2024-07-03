// Adding event listener for the plant form submission
document.getElementById('plant-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const newPlant = {
        name: document.getElementById('plant-name').value,
        date: document.getElementById('plant-date').value,
        growTime: document.getElementById('plant-grow-time').value,
        waterAmount: document.getElementById('water-amount').value,
        wateringFrequency: document.getElementById('watering-frequency').value,
        nutrientBrand: document.getElementById('plant-nutrient-brand').value,
        nutrients: Array.from(document.querySelectorAll('input[name="nutrients"]:checked')).map(nutrient => ({
            name: nutrient.value,
            modifier: document.getElementById(`plant-${nutrient.value.toLowerCase().replace(/ /g, '-')}-modifier`).value
        }))
    };

    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.push(newPlant);
    localStorage.setItem('plants', JSON.stringify(plants));

    document.getElementById('plant-form').reset();
    renderPlants();
});

// Adding event listener for the import plants button
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

// Function to import plants from a file
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

// Function to render plants
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
            <p>Nutrient Brand: ${plant.nutrientBrand}</p>
            ${plant.nutrients.map(nutrient => `
                <p>${nutrient.name} Modifier: ${nutrient.modifier} %</p>
            `).join('')}
            <button onclick="editPlant(${index})">Edit</button>
        `;
        plantList.appendChild(plantItem);
    });
}

// Function to save the edited plant details
function savePlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];

    const updatedPlant = {
        name: document.getElementById('edit-plant-name').value,
        date: document.getElementById('edit-plant-date').value,
        growTime: document.getElementById('edit-plant-grow-time').value,
        waterAmount: document.getElementById('edit-water-amount').value,
        wateringFrequency: document.getElementById('edit-watering-frequency').value,
        nutrientBrand: document.getElementById('edit-plant-nutrient-brand').value,
        nutrients: Array.from(document.querySelectorAll('input[name="edit-nutrients"]:checked')).map(nutrient => ({
            name: nutrient.value,
            modifier: document.getElementById(`edit-plant-${nutrient.value.toLowerCase().replace(/ /g, '-')}-modifier`).value
        }))
    };

    plants[index] = updatedPlant;
    localStorage.setItem('plants', JSON.stringify(plants));
    closeEditForm();
    renderPlants();
}

// Function to close the edit form
function closeEditForm() {
    const editForm = document.getElementById('edit-plant-form');
    if (editForm) {
        editForm.remove();
    }
}

// Function to edit a plant
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

    document.body.appendChild(editForm);
    updateEditNutrientOptions(index);
}

// Function to update nutrient options in the edit form based on the selected nutrient brand
function updateEditNutrientOptions(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plant = plants[index];
    const nutrientBrand = document.getElementById('edit-plant-nutrient-brand').value;
    const nutrientOptions = document.getElementById('edit-nutrient-options');
    nutrientOptions.innerHTML = '';

    const nutrientList = {
        'Fox Farms Trio': ['Big Bloom', 'Grow Big', 'Tiger Bloom'],
        'General Hydroponics': ['FloraGro', 'FloraBloom', 'FloraMicro'],
        'Advanced Nutrients': ['Sensi Grow', 'Sensi Bloom', 'Bud Candy'],
        'Botanicare': ['Pure Blend Pro Grow', 'Pure Blend Pro Bloom', 'Cal-Mag Plus'],
        'Dyna-Gro': ['Grow', 'Bloom', 'Pro-Tekt'],
        'Roots Organics': ['Buddha Grow', 'Buddha Bloom', 'Surge']
    };

    nutrientList[nutrientBrand].forEach((nutrient, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `edit-plant-${nutrient.toLowerCase().replace(/ /g, '-')}`;
        checkbox.name = 'edit-nutrients';
        checkbox.value = nutrient;
        checkbox.onchange = () => toggleEditNutrientModifier(nutrient, index);

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = nutrient;

        nutrientOptions.appendChild(checkbox);
        nutrientOptions.appendChild(label);
        nutrientOptions.appendChild(document.createElement('br'));
    });

    plant.nutrients.forEach(nutrient => {
        const checkbox = document.getElementById(`edit-plant-${nutrient.name.toLowerCase().replace(/ /g, '-')}`);
        if (checkbox) {
            checkbox.checked = true;
            toggleEditNutrientModifier(nutrient.name, index, nutrient.modifier);
        }
    });
}

// Function to toggle the nutrient modifier input in the edit form
function toggleEditNutrientModifier(nutrient, index, modifierValue = '') {
    const nutrientOptions = document.getElementById('edit-nutrient-options');
    const existingModifier = document.getElementById(`edit-plant-${nutrient.toLowerCase().replace(/ /g, '-')}-modifier`);

    if (!existingModifier) {
        const modifier = document.createElement('input');
        modifier.type = 'number';
        modifier.id = `edit-plant-${nutrient.toLowerCase().replace(/ /g, '-')}-modifier`;
        modifier.name = 'edit-nutrient-modifier';
        modifier.placeholder = `${nutrient} Modifier (%)`;
        modifier.value = modifierValue;
        modifier.required = true;
        nutrientOptions.appendChild(modifier);
    } else {
        existingModifier.remove();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderPlants();
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
});
