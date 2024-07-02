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

    const bigBloomModifierInput = document.createElement('input');
    bigBloomModifierInput.type = 'number';
    bigBloomModifierInput.value = 100;
    bigBloomModifierInput.placeholder = 'Big Bloom Modifier (%)';
    bigBloomModifierInput.addEventListener('input', updateNutrientSchedule);

    const growBigModifierInput = document.createElement('input');
    growBigModifierInput.type = 'number';
    growBigModifierInput.value = 100;
    growBigModifierInput.placeholder = 'Grow Big Modifier (%)';
    growBigModifierInput.addEventListener('input', updateNutrientSchedule);

    const tigerBloomModifierInput = document.createElement('input');
    tigerBloomModifierInput.type = 'number';
    tigerBloomModifierInput.value = 100;
    tigerBloomModifierInput.placeholder = 'Tiger Bloom Modifier (%)';
    tigerBloomModifierInput.addEventListener('input', updateNutrientSchedule);

    const nutrientSchedule = document.createElement('div');

    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Water Amount: '));
    plantItem.appendChild(waterAmountInput);
    plantItem.appendChild(document.createTextNode(' fluid oz'));
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Watering Frequency: '));
    plantItem.appendChild(wateringFrequencySelect);
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Big Bloom Modifier: '));
    plantItem.appendChild(bigBloomModifierInput);
    plantItem.appendChild(document.createTextNode('%'));
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Grow Big Modifier: '));
    plantItem.appendChild(growBigModifierInput);
    plantItem.appendChild(document.createTextNode('%'));
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Tiger Bloom Modifier: '));
    plantItem.appendChild(tigerBloomModifierInput);
    plantItem.appendChild(document.createTextNode('%'));
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
        const bigBloomModifier = bigBloomModifierInput.value / 100;
        const growBigModifier = growBigModifierInput.value / 100;
        const tigerBloomModifier = tigerBloomModifierInput.value / 100;

        if (waterAmount && wateringFrequency) {
            const schedule = generateNutrientSchedule(plantDate, growTime, waterAmount, wateringFrequency, bigBloomModifier, growBigModifier, tigerBloomModifier);
            nutrientSchedule.innerHTML = schedule.map(entry => `
                <div>${entry.date.toDateString()}: Big Bloom - ${entry.bigBloom} tsp, Grow Big - ${entry.growBig} tsp, Tiger Bloom - ${entry.tigerBloom} tsp</div>
            `).join('');
        }
    }
});

function generateNutrientSchedule(startDate, growTime, waterAmount, frequency, bigBloomModifier, growBigModifier, tigerBloomModifier) {
    const weeks = growTime;
    const schedule = [];
    let currentDate = new Date(startDate);

    for (let week = 1; week <= weeks; week++) {
        for (let day = 0; day < 7; day += parseInt(frequency, 10)) {
            const nutrients = calculateNutrients(week, waterAmount, bigBloomModifier, growBigModifier, tigerBloomModifier);
            schedule.push({
                date: new Date(currentDate),
                ...nutrients
            });
            currentDate.setDate(currentDate.getDate() + parseInt(frequency, 10));
        }
    }
    
    return schedule;
}

function calculateNutrients(week, waterAmount, bigBloomModifier, growBigModifier, tigerBloomModifier) {
    let bigBloom = 0, growBig = 0, tigerBloom = 0;

    if (week >= 1 && week <= 4) {
        bigBloom = (waterAmount / 128) * 6 * bigBloomModifier; // 6 tsp/gallon
        if (week >= 2) {
            growBig = (waterAmount / 128) * 3 * growBigModifier; // 3 tsp/gallon
        }
    } else if (week >= 5 && week <= 8) {
        bigBloom = (waterAmount / 128) * 3 * bigBloomModifier; // 3 tsp/gallon
        tigerBloom = (waterAmount / 128) * 2 * tigerBloomModifier; // 2 tsp/gallon
    } else if (week >= 9 && week <= 12) {
        bigBloom = (waterAmount / 128) * 3 * bigBloomModifier; // 3 tsp/gallon
        tigerBloom = (waterAmount / 128) * 2 * tigerBloomModifier; // 2 tsp/gallon
    }

    return { bigBloom: bigBloom.toFixed(2), growBig: growBig.toFixed(2), tigerBloom: tigerBloom.toFixed(2) };
}
