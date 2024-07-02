document.addEventListener('DOMContentLoaded', loadPlantsFromStorage);

document.getElementById('plant-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const plantName = document.getElementById('plant-name').value;
    const plantDate = new Date(document.getElementById('plant-date').value);
    const growTime = parseInt(document.getElementById('plant-grow-time').value, 10);
    
    const plant = {
        name: plantName,
        date: plantDate.toISOString().split('T')[0],
        growTime: growTime,
        waterAmount: 20,
        wateringFrequency: 1,
        nutrientModifiers: {
            bigBloom: 100,
            growBig: 100,
            tigerBloom: 100
        }
    };
    
    savePlantToStorage(plant);
    addPlantToDOM(plant);
    
    document.getElementById('plant-form').reset();
});

document.getElementById('save-to-file').addEventListener('click', savePlantsToFile);
document.getElementById('import-plants').addEventListener('click', importPlantsFromFile);

function savePlantToStorage(plant) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.push(plant);
    localStorage.setItem('plants', JSON.stringify(plants));
}

function loadPlantsFromStorage() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.forEach(addPlantToDOM);
}

function savePlantsToFile() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const blob = new Blob([JSON.stringify(plants, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plants.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importPlantsFromFile() {
    const fileInput = document.getElementById('load-from-file');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const plants = JSON.parse(e.target.result);
        localStorage.setItem('plants', JSON.stringify(plants));
        document.getElementById('plants').innerHTML = '';
        plants.forEach(addPlantToDOM);
    };
    reader.readAsText(file);
}

function addPlantToDOM(plant) {
    const plantList = document.getElementById('plants');
    
    const plantItem = document.createElement('li');
    plantItem.classList.add('plant-item');
    plantItem.innerHTML = `
        <strong>${plant.name}</strong> (Planted on: ${plant.date})<br>
        <label>Water Amount: <input type="number" class="water-amount" value="${plant.waterAmount}"></label><br>
        <label>Watering Frequency: <select class="watering-frequency">
            ${Array.from({length: 7}, (_, i) => `<option value="${i+1}" ${plant.wateringFrequency == i+1 ? 'selected' : ''}>${i+1} day${i > 0 ? 's' : ''}</option>`).join('')}
        </select></label><br>
        <label>Big Bloom Modifier: <input type="number" class="big-bloom-modifier" value="${plant.nutrientModifiers.bigBloom}"></label><br>
        <label>Grow Big Modifier: <input type="number" class="grow-big-modifier" value="${plant.nutrientModifiers.growBig}"></label><br>
        <label>Tiger Bloom Modifier: <input type="number" class="tiger-bloom-modifier" value="${plant.nutrientModifiers.tigerBloom}"></label><br>
        <div class="nutrient-schedule"></div>
    `;
    plantList.appendChild(plantItem);
    
    const waterAmountInput = plantItem.querySelector('.water-amount');
    const wateringFrequencySelect = plantItem.querySelector('.watering-frequency');
    const bigBloomModifierInput = plantItem.querySelector('.big-bloom-modifier');
    const growBigModifierInput = plantItem.querySelector('.grow-big-modifier');
    const tigerBloomModifierInput = plantItem.querySelector('.tiger-bloom-modifier');
    const nutrientSchedule = plantItem.querySelector('.nutrient-schedule');

    function updateNutrientSchedule() {
        const waterAmount = waterAmountInput.value;
        const wateringFrequency = wateringFrequencySelect.value;
        const nutrientModifiers = {
            bigBloom: bigBloomModifierInput.value,
            growBig: growBigModifierInput.value,
            tigerBloom: tigerBloomModifierInput.value
        };

        if (waterAmount && wateringFrequency) {
            const schedule = generateNutrientSchedule(new Date(plant.date), plant.growTime, waterAmount, wateringFrequency, nutrientModifiers);
            nutrientSchedule.innerHTML = generateScheduleTable(schedule);
        }
    }

    waterAmountInput.addEventListener('input', updateNutrientSchedule);
    wateringFrequencySelect.addEventListener('change', updateNutrientSchedule);
    bigBloomModifierInput.addEventListener('input', updateNutrientSchedule);
    growBigModifierInput.addEventListener('input', updateNutrientSchedule);
    tigerBloomModifierInput.addEventListener('input', updateNutrientSchedule);

    updateNutrientSchedule();
}

function generateNutrientSchedule(startDate, growTime, waterAmount, frequency, nutrientModifiers) {
    const weeks = growTime;
    const schedule = [];
    let currentDate = new Date(startDate);

    for (let week = 1; week <= weeks; week++) {
        for (let day = 0; day < 7; day += parseInt(frequency, 10)) {
            const nutrients = calculateNutrients(week, waterAmount, nutrientModifiers);
            schedule.push({
                date: new Date(currentDate),
                ...nutrients
            });
            currentDate.setDate(currentDate.getDate() + parseInt(frequency, 10));
        }
    }
    
    return schedule;
}

function calculateNutrients(week, waterAmount, nutrientModifiers) {
    let bigBloom = 0, growBig = 0, tigerBloom = 0;

    if (week >= 1 && week <= 4) {
        bigBloom = (waterAmount / 128) * 6 * (nutrientModifiers.bigBloom / 100); // 6 tsp/gallon
        if (week >= 2) {
            growBig = (waterAmount / 128) * 3 * (nutrientModifiers.growBig / 100); // 3 tsp/gallon
        }
    } else if (week >= 5 && week <= 8) {
        bigBloom = (waterAmount / 128) * 3 * (nutrientModifiers.bigBloom / 100); // 3 tsp/gallon
        tigerBloom = (waterAmount / 128) * 2 * (nutrientModifiers.tigerBloom / 100); // 2 tsp/gallon
    } else if (week >= 9 && week <= 12) {
        bigBloom = (waterAmount / 128) * 3 * (nutrientModifiers.bigBloom / 100); // 3 tsp/gallon
        tigerBloom = (waterAmount / 128) * 2 * (nutrientModifiers.tigerBloom / 100); // 2 tsp/gallon
    }

    return { bigBloom: bigBloom.toFixed(2), growBig: growBig.toFixed(2), tigerBloom: tigerBloom.toFixed(2) };
}

function generateScheduleTable(schedule) {
    let table = `<table>
                    <tr>
                        <th>Date</th>
                        <th>Grow Big</th>
                        <th>Big Bloom</th>
                        <th>Tiger Bloom</th>
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
