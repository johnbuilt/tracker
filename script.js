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
        const waterAmount = document.getElementById('water-amount').value;
        const photo = document.getElementById('plant-photo').files[0];
        
        if (name && date && waterAmount) {
            const plant = {
                id: Date.now(),
                name: name,
                date: date,
                waterAmount: waterAmount,
                photo: photo ? URL.createObjectURL(photo) : null
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
        // Example nutrient calculation for Fox Farms Trio
        const nutrients = {
            growBig: waterAmount * 2,  // Example ratio
            tigerBloom: waterAmount * 1.5,  // Example ratio
            bigBloom: waterAmount * 4  // Example ratio
        };
        return nutrients;
    }
    
    function renderPlants() {
        const plants = getPlants();
        plantList.innerHTML = '';
        plants.forEach(plant => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${plant.name}</strong> (Planted on: ${plant.date})<br>
                Water Amount: ${plant.waterAmount} gallons<br>
                Nutrients: Grow Big - ${calculateNutrients(plant.waterAmount).growBig} tsp, Tiger Bloom - ${calculateNutrients(plant.waterAmount).tigerBloom} tsp, Big Bloom - ${calculateNutrients(plant.waterAmount).bigBloom} tsp<br>
                ${plant.photo ? `<img src="${plant.photo}" alt="${plant.name} photo" style="max-width: 200px; max-height: 200px;">` : ''}
            `;
            plantList.appendChild(li);
        });
    }
    
    renderPlants();
});
