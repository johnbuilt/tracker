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
    
    const nutrientSchedule = document.createElement('div');

    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Water Amount: '));
    plantItem.appendChild(waterAmountInput);
    plantItem.appendChild(document.createTextNode(' fluid oz'));
    plantItem.appendChild(document.createElement('br'));
    plantItem.appendChild(document.createTextNode('Watering Frequency: '));
    plantItem.appendChild(wateringFrequencySelect);
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
            nutrientSchedule.innerHTML = generateScheduleTable(schedule);
        }
    }
});

function generateNutrientSchedule(startDate, growTime, waterAmount, frequency) {
    const weeks = growTime;
    const schedule = [];
    let currentDate = new Date(startDate);

    for (let week = 1; week <= weeks; week++) {
        for (let day = 0; day < 7; day += parseInt(frequency, 10)) {
            const nutrients = calculateNutrients(week, waterAmount);
            schedule.push({
                date: new Date(currentDate),
                ...nutrients
            });
            currentDate.setDate(currentDate.getDate() + parseInt(frequency, 10));
        }
    }
    
    return schedule;
}

function calculateNutrients(week, waterAmount) {
    let bigBloom = 0, growBig = 0, tigerBloom = 0;

    if (week >= 1 && week <= 4) {
        bigBloom = (waterAmount / 128) * 6; // 6 tsp/gallon
        if (week >= 2) {
            growBig = (waterAmount / 128) * 3; // 3 tsp/gallon
        }
    } else if (week >= 5 && week <= 8) {
        bigBloom = (waterAmount / 128) * 3; // 3 tsp/gallon
        tigerBloom = (waterAmount / 128) * 2; // 2 tsp/gallon
    } else if (week >= 9 && week <= 12) {
        bigBloom = (waterAmount / 128) * 3; // 3 tsp/gallon
        tigerBloom = (waterAmount / 128) * 2; // 2 tsp/gallon
    }

    return { bigBloom: bigBloom.toFixed(2), growBig: growBig.toFixed(2), tigerBloom: tigerBloom.toFixed(2) };
}

function generateScheduleTable(schedule) {
    let table = `<table>
                    <tr>
                        <th>Date</th>
                        <th>Grow Big<br><input type="number" id="grow-big-modifier" value="100" onchange="updateModifier(this, 'growBig')">%<br></th>
                        <th>Big Bloom<br><input type="number" id="big-bloom-modifier" value="100" onchange="updateModifier(this, 'bigBloom')">%<br></th>
                        <th>Tiger Bloom<br><input type="number" id="tiger-bloom-modifier" value="100" onchange="updateModifier(this, 'tigerBloom')">%<br></th>
                    </tr>`;
    schedule.forEach(entry => {
        table += `<tr>
                    <td>${entry.date.toDateString()}</td>
                    <td>${entry.growBig} tsp</td>
                    <td>${entry.bigBloom} tsp</td>
                    <td>${entry.tigerBloom} tsp</td>
                  </tr>`;
    });
    table += `</table>`;
    return table;
}

function updateModifier(input, nutrient) {
    const modifier = parseFloat(input.value) / 100;
    document.querySelectorAll(`.${nutrient}`).forEach(cell => {
        const baseValue = parseFloat(cell.dataset.base);
        cell.textContent = (baseValue * modifier).toFixed(2) + ' tsp';
    });
}
