document.getElementById('plant-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const plantName = document.getElementById('plant-name').value;
    const plantDate = new Date(document.getElementById('plant-date').value);
    const growTime = parseInt(document.getElementById('plant-grow-time').value, 10);
    const plantList = document.getElementById('plants');
    
    const plantItem = document.createElement('li');
    plantItem.classList.add('plant-item');
    plantItem.innerHTML = `
        <strong>${plantName}</strong> (Planted on: ${plantDate.toISOString().split('T')[0]})<br>
        <label>Water Amount: <input type="number" placeholder="Water Amount (fluid oz)" class="water-amount"></label><br>
        <label>Watering Frequency: <select class="watering-frequency">
            ${Array.from({length: 7}, (_, i) => `<option value="${i+1}">${i+1} day${i > 0 ? 's' : ''}</option>`).join('')}
        </select></label><br>
        <div class="nutrient-schedule"></div>
    `;
    plantList.appendChild(plantItem);
    
    const waterAmountInput = plantItem.querySelector('.water-amount');
    const wateringFrequencySelect = plantItem.querySelector('.watering-frequency');
    const nutrientSchedule = plantItem.querySelector('.nutrient-schedule');

    waterAmountInput.addEventListener('input', updateNutrientSchedule);
    wateringFrequencySelect.addEventListener('change', updateNutrientSchedule);

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
                        <th>Date<br><input type="number" id="watering-frequency-modifier" value="2" onchange="updateModifier(this, 'wateringFrequency')">%<br></th>
                        <th>Grow Big<br><input type="number" id="grow-big-modifier" value="100" onchange="updateModifier(this, 'growBig')">%<br></th>
                        <th>Big Bloom<br><input type="number" id="big-bloom-modifier" value="100" onchange="updateModifier(this, 'bigBloom')">%<br></th>
                        <th>Tiger Bloom<br><input type="number" id="tiger-bloom-modifier" value="100" onchange="updateModifier(this, 'tigerBloom')">%<br></th>
                    </tr>`;
    schedule.forEach(entry => {
        table += `<tr>
                    <td>${entry.date.toDateString()}</td>
                    <td class="growBig" data-base="${entry.growBig}">${entry.growBig} tsp</td>
                    <td class="bigBloom" data-base="${entry.bigBloom}">${entry.bigBloom} tsp</td>
                    <td class="tigerBloom" data-base="${entry.tigerBloom}">${entry.tigerBloom} tsp</td>
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
