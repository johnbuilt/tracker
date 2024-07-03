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
