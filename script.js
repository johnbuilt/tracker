// Page switching
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

// Add plant functionality
document.getElementById('plant-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const plant = {
        name: document.getElementById('plant-name').value,
        date: document.getElementById('plant-date').value,
        growTime: document.getElementById('plant-grow-time').value,
    };

    let plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.push(plant);
    localStorage.setItem('plants', JSON.stringify(plants));
    alert('Plant added successfully!');
    document.getElementById('plant-form').reset();
    renderPlants();
});

// Render plants
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
            <button onclick="editPlant(${index})">Edit</button>
        `;
        plantList.appendChild(plantItem);
    });
}

// Initial rendering
document.addEventListener('DOMContentLoaded', function () {
    renderPlants();
});
