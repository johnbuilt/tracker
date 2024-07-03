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
