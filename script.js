document.getElementById('plant-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const plantName = document.getElementById('plant-name').value;
    const plantDate = new Date(document.getElementById('plant-date').value);
    const growTime = parseInt(document.getElementById('plant-grow-time').value, 10);
    const plantList = document.getElementById('plants');
    
    const plantItem = document.createElement('li');
    plantItem.textContent = `${plantName} (Planted on: ${plantDate.toISOString().split('T')[0]})`;
    
    const waterAmountInput = document.createElement('input');
    waterAmountInput.type = 'number';
    waterAmountInput.placeholder = 'Water Amount (fluid oz)';
    waterAmountInput.addEventListener('input', updateNutrientSchedule);

    const wateringFrequencySelect = document.createElement('select');
    for (let i = 1; i <= 7; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} day${i > 1 ? 's' : ''}`;
        wateringFrequencySelect.appendChild(option);
    }
    wateringFrequencySelect.addEventListener('change', updateNutrientSchedule);
    
    const photoUploadInput = document.createElement('input');
    photoUploadInput.type = 'file';
    photoUploadInput.accept = 'image/*';

    const nutrientSchedule = document.createElement('div');

    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Water Amount: '));
    plantItem.appendChild(waterAmountInput);
    plantItem.appendChild(document.createTextNode(' fluid oz'));
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Watering Frequency: '));
    plantItem.appendChild(wateringFrequencySelect);
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Upload Photo: '));
    plantItem.appendChild(photoUploadInput);
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Nutrient Schedule'));
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(nutrientSchedule);

    plantList.appendChild(plantItem);

    function updateNutrientSchedule() {
        const waterAmount = waterAmountInput.value;
        const wateringFrequency = wateringFrequencySelect.value;
        if (waterAmount && wateringFrequency) {
            const schedule = generateNutrientSchedule(plantDate, growTime, waterAmount, wateringFrequency);
            nutrientSchedule.innerHTML = schedule.map(entry => `
                <div>${entry.date.toDateString()}: Big Bloom - ${entry.bigBloom} tsp, Grow Big - ${entry.growBig} tsp, Tiger Bloom - ${entry.tigerBloom} tsp</div>
            `).join('');
        }
    }
});

function generateNutrientSchedule(startDate, growTime, waterAmount, frequency) {
    const weeks = growTime;
    const schedule = [];
    let currentDate = new Date(startDate);

    for (let week = 1; week <= weeks; week++) {
        for (let day = 0; day < 7; day++) {
            const nutrients = calculateNutrients(week, waterAmount);
            schedule.push({
                date: new Date(currentDate),
                ...nutrients
            });
            currentDate.setDate(currentDate.getDate() + frequency);
        }
    }
    
    return schedule;
}

function calculateNutrients(week, waterAmount) {
    let bigBloom = 0, growBig = 0, tigerBloom = 0;

    if (week <= 4) {
        bigBloom = waterAmount * 0.94;
        if (week >= 2) {
            growBig = waterAmount * 0.47;
        }
    } else if (week <= 8) {
        bigBloom = waterAmount * 0.94;
        if (week >= 6) {
            tigerBloom = waterAmount * 0.47;
        }
    } else if (week <= 12) {
        bigBloom = waterAmount * 0.94;
        tigerBloom = waterAmount * 0.94;
    }

    return { bigBloom, growBig, tigerBloom };
}
