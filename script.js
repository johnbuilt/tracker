// Event listener for plant form submission
document.getElementById('plant-form').addEventListener('submit', function (event) {
    event.preventDefault();
    addPlant();
});

// Function to add a new plant
function addPlant() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];

    const newPlant = {
        name: document.getElementById('plant-name').value,
        date: document.getElementById('plant-date').value,
        growTime: document.getElementById('plant-grow-time').value,
        waterAmount: document.getElementById('plant-water-amount').value,
        wateringFrequency: document.getElementById('plant-watering-frequency').value,
        nutrientBrand: document.getElementById('plant-nutrient-brand').value,
        nutrients: Array.from(document.querySelectorAll('input[name="nutrients"]:checked')).map(nutrient => ({
            name: nutrient.value,
            modifier: document.getElementById(`plant-${nutrient.value.toLowerCase().replace(/ /g, '-')}-modifier`).value
        }))
    };

    plants.push(newPlant);
    localStorage.setItem('plants', JSON.stringify(plants));
    renderPlants();
    clearForm();
}

// Function to clear the form after adding a plant
function clearForm() {
    document.getElementById('plant-form').reset();
    updateNutrientOptions(); // Clear nutrient options as well
}

// Function to render plants on the "My Plants" page
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

// Function to update nutrient options based on the selected nutrient brand
function updateNutrientOptions() {
    const nutrientBrand = document.getElementById('plant-nutrient-brand').value;
    const nutrientOptions = document.getElementById('nutrient-options');
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
        checkbox.id = `plant-${nutrient.toLowerCase().replace(/ /g, '-')}`;
        checkbox.name = 'nutrients';
        checkbox.value = nutrient;
        checkbox.onchange = () => toggleNutrientModifier(nutrient, index);

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = nutrient;

        nutrientOptions.appendChild(checkbox);
        nutrientOptions.appendChild(label);
        nutrientOptions.appendChild(document.createElement('br'));

        const modifierInput = document.createElement('input');
        modifierInput.type = 'number';
        modifierInput.id = `plant-${nutrient.toLowerCase().replace(/ /g, '-')}-modifier`;
        modifierInput.placeholder = `${nutrient} Modifier (%)`;
        modifierInput.style.display = 'none';
        nutrientOptions.appendChild(modifierInput);
    });
}

// Toggle the display of nutrient modifier input based on the checkbox state
function toggleNutrientModifier(nutrient, index) {
    const checkbox = document.getElementById(`plant-${nutrient.toLowerCase().replace(/ /g, '-')}`);
    const modifierInput = document.getElementById(`plant-${nutrient.toLowerCase().replace(/ /g, '-')}-modifier`);
    modifierInput.style.display = checkbox.checked ? 'block' : 'none';
}

// Toggle the display of nutrient modifier input in the edit form based on the checkbox state
function toggleEditNutrientModifier(nutrient, index) {
    const checkbox = document.getElementById(`edit-plant-${nutrient.toLowerCase().replace(/ /g, '-')}`);
    const modifierInput = document.getElementById(`edit-plant-${nutrient.toLowerCase().replace(/ /g, '-')}-modifier`);
    modifierInput.style.display = checkbox.checked ? 'block' : 'none';
}

// Function to handle import of plants
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

// Save the edited plant details
function savePlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];

    const updatedPlant = {
        name: document.getElementById('edit-plant-name').value,
        date: document.getElementById('edit-plant-date').value,
        growTime: document.getElementById('edit-plant-grow-time').value,
        waterAmount: document.getElementById('edit-water-amount').value,
        wateringFrequency: document.getElementById('edit-watering-frequency').value,
        nutrientBrand: document.getElementById('edit-plant-nutrient-brand').value,
        nutrients: Array.from(document.querySelectorAll('input[name="nutrients"]:checked')).map(nutrient => ({
            name: nutrient.value,
            modifier: document.getElementById(`edit-plant-${nutrient.value.toLowerCase().replace(/ /g, '-')}-modifier`).value
        }))
    };

    plants[index] = updatedPlant;
    localStorage.setItem('plants', JSON.stringify(plants));
    closeEditForm();
    renderPlants();
}

// Close the edit form
function closeEditForm() {
    const editForm = document.getElementById('edit-plant-form');
    if (editForm) {
        editForm.remove();
    }
}

// Initial rendering of plants
document.addEventListener('DOMContentLoaded', function () {
    renderPlants();
});

// Event listeners for the navbar links
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
