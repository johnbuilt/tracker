document.addEventListener('DOMContentLoaded', function() {
    const plantForm = document.getElementById('plant-form');
    const plantList = document.getElementById('plants');
    
    plantForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addPlant();
    });
    
    function addPlant() {
        const name = document.getElementById('plant-name').value;
        const date = document.getElementById('plant-date').value;
        const growTime = parseInt(document.getElementById('plant-grow-time').value, 10);
        
        if (name && date && growTime) {
            const plant = {
                id: Date.now(),
                name: name,
                date: date,
                waterAmount: 0,
                wateringFrequency: 1,
                growTime: growTime,
                photo: null
            };
            
            const plants = getPlants();
            plants.push(plant);
            savePlants(plants);
            renderPlants();
            
            plantForm.reset();
        }
    }
    
    function getPlants() {
        const plants = localStorage.getItem('plants');
        return plants ? JSON.parse(plants) : [];
    }
    
    function savePlants(plants) {
        localStorage.setItem('plants', JSON.stringify(plants));
    }
    
    function calculateNutrients(waterAmount, week) {
        const waterInGallons = waterAmount / 128;
        
        const nutrientSchedule = {
            1: { bigBloom: 3, growBig: 0, tigerBloom: 0 },
            2: { bigBloom: 3, growBig: 0.25, tigerBloom: 0 },
            3: { bigBloom: 3, growBig: 0.25, tigerBloom: 0 },
            4: { bigBloom: 3, growBig: 0.25, tigerBloom: 0 },
            5: { bigBloom: 3, growBig: 0.25, tigerBloom: 0 },
            6: { bigBloom: 3, growBig: 0.25, tigerBloom: 0 },
            7: { bigBloom: 3, growBig: 0.25, tigerBloom: 0 },
            8: { bigBloom: 3, growBig: 0, tigerBloom: 0.25 },
            9: { bigBloom: 3, growBig: 0, tigerBloom: 0.25 },
            10: { bigBloom: 3, growBig: 0, tigerBloom: 0.25 },
            11: { bigBloom: 3, growBig: 0, tigerBloom: 0.25 },
            12: { bigBloom: 3, growBig: 0, tigerBloom: 0.25 }
        };
        
        const nutrients = nutrientSchedule[week] || { bigBloom: 0, growBig: 0, tigerBloom: 0 };
        return {
            bigBloom: waterInGallons * nutrients.bigBloom,
            growBig: waterInGallons * nutrients.growBig,
            tigerBloom: waterInGallons * nutrients.tigerBloom
        };
    }
    
    function updatePlantWaterAmount(id, waterAmount) {
        const plants = getPlants();
        const plant = plants.find(p => p.id === id);
        if (plant) {
            plant.waterAmount = parseFloat(waterAmount) || 0;
            savePlants(plants);
            renderPlants();
        }
    }

    function updatePlantWateringFrequency(id, frequency) {
        const plants = getPlants();
        const plant = plants.find(p => p.id === id);
        if (plant) {
            plant.wateringFrequency = parseInt(frequency, 10) || 1;
            savePlants(plants);
            renderPlants();
        }
    }

    function updatePlantPhoto(id, photo) {
        const plants = getPlants();
        const plant = plants.find(p => p.id === id);
        if (plant) {
            plant.photo = URL.createObjectURL(photo);
            savePlants(plants);
            renderPlants();
        }
    }

    function generateNutrientSchedule(plant) {
        const schedule = [];
        const frequency = plant.wateringFrequency;
        let currentDate = new Date(plant.date);
        const today = new Date();
        let week = Math.floor((today - new Date(plant.date)) / (7 * 24 * 60 * 60 * 1000)) + 1; // Calculate the week number
        
        for (let i = 0; i < plant.growTime * 7; i += frequency) {
            const nutrients = calculateNutrients(plant.waterAmount, week);
            schedule.push({
                date: new Date(currentDate),
                nutrients: { ...nutrients }
            });
            currentDate.setDate(currentDate.getDate() + frequency);
            week += 1; // Increment the week
        }
        return schedule;
    }
    
    function renderPlants() {
        const plants = getPlants();
        plantList.innerHTML = '';
        plants.forEach(plant => {
            const li = document.createElement('li');
            const schedule = generateNutrientSchedule(plant);
            const scheduleHtml = schedule.map(entry => `
                <div>
                    <strong>${entry.date.toDateString()}</strong>: 
                    Big Bloom - ${entry.nutrients.bigBloom.toFixed(2)} tsp, 
                    Grow Big - ${entry.nutrients.growBig.toFixed(2)} tsp, 
                    Tiger Bloom - ${entry.nutrients.tigerBloom.toFixed(2)} tsp
                </div>
            `).join('');

            li.innerHTML = `
                <strong>${plant.name}</strong> (Planted on: ${plant.date})<br>
                Water Amount: <input type="number" value="${plant.waterAmount}" step="0.1" onchange="updatePlantWaterAmount(${plant.id}, this.value)"> fluid oz<br>
                Watering Frequency: <select onchange="updatePlantWateringFrequency(${plant.id}, this.value)">
                    ${[...Array(7).keys()].map(i => `<option value="${i + 1}" ${plant.wateringFrequency === (i + 1) ? 'selected' : ''}>${i + 1}</option>`).join('')}
                </select> days<br>
                Nutrients: Big Bloom - ${calculateNutrients(plant.waterAmount, 1).bigBloom.toFixed(2)} tsp, 
                Grow Big - ${calculateNutrients(plant.waterAmount, 1).growBig.toFixed(2)} tsp, 
                Tiger Bloom - ${calculateNutrients(plant.waterAmount, 1).tigerBloom.toFixed(2)} tsp<br>
                Upload Photo: <input type="file" accept="image/*" onchange="updatePlantPhoto(${plant.id}, this.files[0])"><br>
                ${plant.photo ? `<img src="${plant.photo}" alt="${plant.name} photo" style="max-width: 200px; max-height: 200px;">` : ''}
                <h3>Nutrient Schedule</h3>
                ${scheduleHtml}
            `;
            plantList.appendChild(li);
        });
    }
    
    window.updatePlantWaterAmount = updatePlantWaterAmount;
    window.updatePlantWateringFrequency = updatePlantWateringFrequency;
    window.updatePlantPhoto = updatePlantPhoto;
    
    renderPlants();
});
