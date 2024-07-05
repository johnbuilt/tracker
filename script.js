document.addEventListener('DOMContentLoaded', function () {
    // Render plants on page load
    renderPlants();

    // Add plant form submission
    document.getElementById('plant-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const plant = {
            name: document.getElementById('plant-name').value,
            date: document.getElementById('plant-date').value,
            growTime: document.getElementById('plant-grow-time').value
        };

        console.log('Adding plant:', plant); // Debugging log

        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        plants.push(plant);
        localStorage.setItem('plants', JSON.stringify(plants));

        renderPlants();
        this.reset();
        showPopup('Plant successfully added!');
    });

    // Navigation bar functionality
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

    // Import plants functionality
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

    // Save plants functionality
    document.getElementById('save-plants-button').addEventListener('click', function () {
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plants));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "plants.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showPopup('Plants successfully saved!');
    });
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

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
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
        <button onclick="savePlant(${index})">Save</button>
        <button onclick="closeEditForm()">Cancel</button>
    `;

    const plantList = document.getElementById('plants');
    plantList.appendChild(editForm);
}

function savePlant(index) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];

    const updatedPlant = {
        name: document.getElementById('edit-plant-name').value,
        date: document.getElementById('edit-plant-date').value,
        growTime: document.getElementById('edit-plant-grow-time').value
    };

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
