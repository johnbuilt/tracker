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
        
        if (name && date) {
            const plant = {
                id: Date.now(),
                name: name,
                date: date,
                waterAmount: 0,
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
    
    function calculateNutrients(waterAmount) {
        const waterInGallons = waterAmount / 128;
        
        const nutrients = {
            growBig: waterInGallons * 2,
            tigerBloom: waterInGallons * 1.5,
            bigBloom: waterInGallons * 4
        };
        return nutrients;
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

    function updatePlantPhoto(id, photo) {
        const plants = getPlants();
        const plant = plants.find(p => p.id === id);
        if (plant) {
            plant.photo = URL.createObjectURL(photo);
            savePlants(plants);
            renderPlants();
        }
    }
    
    function renderPlants() {
        const plants = getPlants();
        plantList.innerHTML = '';
        plants.forEach(plant => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${plant.name}</strong> (Planted on: ${plant.date})<br>
                Water Amount: <input type="number" value="${plant.waterAmount}" step="0.1" onchange="updatePlantWaterAmount(${plant.id}, this.value)"> fluid oz<br>
                Nutrients: Grow Big - ${calculateNutrients(plant.waterAmount).growBig.toFixed(2)} tsp, Tiger Bloom - ${calculateNutrients(plant.waterAmount).tigerBloom.toFixed(2)} tsp, Big Bloom - ${calculateNutrients(plant.waterAmount).bigBloom.toFixed(2)} tsp<br>
                Upload Photo: <input type="file" accept="image/*" onchange="updatePlantPhoto(${plant.id}, this.files[0])"><br>
                ${plant.photo ? `<img src="${plant.photo}" alt="${plant.name} photo" style="max-width: 200px; max-height: 200px;">` : ''}
            `;
            plantList.appendChild(li);
        });
    }
    
    window.updatePlantWaterAmount = updatePlantWaterAmount;
    window.updatePlantPhoto = updatePlantPhoto;
    
    renderPlants();
});
