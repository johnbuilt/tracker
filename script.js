document.addEventListener('DOMContentLoaded', function () {
    // Existing code...

    document.getElementById('confirmOverwrite').addEventListener('click', () => {
        document.getElementById('import').click();
        document.getElementById('confirmDialog').style.display = 'none';
    });

    document.getElementById('confirmAdd').addEventListener('click', () => {
        document.getElementById('import').click();
        document.getElementById('confirmDialog').style.display = 'none';
    });

    document.getElementById('confirmCancel').addEventListener('click', () => {
        document.getElementById('confirmDialog').style.display = 'none';
    });

    document.getElementById('plant-form').addEventListener('submit', function (e) {
        e.preventDefault();
        addPlant();
    });

    function addPlant() {
        const name = document.getElementById('plant-name').value;
        const date = document.getElementById('plant-date').value;
        const growTime = document.getElementById('plant-grow-time').value;
        const photo = document.getElementById('upload-photo').files[0];
        const plant = {
            name: name,
            date: date,
            growTime: growTime,
            waterAmount: 20,
            wateringFrequency: 1,
            bigBloomModifier: 100,
            growBigModifier: 100,
            tigerBloomModifier: 100,
            photo: photo ? URL.createObjectURL(photo) : null,
        };

        plants.push(plant);
        localStorage.setItem('plants', JSON.stringify(plants));
        renderPlants();
    }

    function renderPlants() {
        const plantsContainer = document.getElementById('plants');
        plantsContainer.innerHTML = '';
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
                <button class="edit-button" data-index="${index}">Edit</button>
            `;
            plantsContainer.appendChild(plantItem);
        });

        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                editPlant(index);
            });
        });
    }

    function editPlant(index) {
        const plant = plants[index];
        document.getElementById('plant-name').value = plant.name;
        document.getElementById('plant-date').value = plant.date;
        document.getElementById('plant-grow-time').value = plant.growTime;

        document.getElementById('add-plant-button').style.display = 'none';
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update Plant';
        updateButton.id = 'update-plant-button';
        updateButton.setAttribute('data-index', index);
        document.getElementById('plant-form').appendChild(updateButton);

        updateButton.addEventListener('click', function (e) {
            e.preventDefault();
            const index = this.getAttribute('data-index');
            plants[index].name = document.getElementById('plant-name').value;
            plants[index].date = document.getElementById('plant-date').value;
            plants[index].growTime = document.getElementById('plant-grow-time').value;
            plants[index].photo = document.getElementById('upload-photo').files[0] ? URL.createObjectURL(document.getElementById('upload-photo').files[0]) : plant.photo;

            localStorage.setItem('plants', JSON.stringify(plants));
            renderPlants();

            document.getElementById('plant-form').reset();
            updateButton.remove();
            document.getElementById('add-plant-button').style.display = 'block';
        });
    }

    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = page.id === pageId ? 'block' : 'none';
        });
    }

    document.getElementById('newPlantTab').addEventListener('click', function () {
        showPage('newPlantPage');
        setActiveTab(this);
    });

    document.getElementById('myPlantsTab').addEventListener('click', function () {
        showPage('myPlantsPage');
        setActiveTab(this);
    });

    document.getElementById('scheduleTab').addEventListener('click', function () {
        showPage('schedulePage');
        setActiveTab(this);
    });

    document.getElementById('settingsTab').addEventListener('click', function () {
        showPage('settingsPage');
        setActiveTab(this);
    });

    function setActiveTab(tab) {
        document.querySelectorAll('.navbar a').forEach(navItem => {
            navItem.classList.remove('active');
        });
        tab.classList.add('active');
    }

    renderPlants();
    showPage('newPlantPage');
    setActiveTab(document.getElementById('newPlantTab'));
});
