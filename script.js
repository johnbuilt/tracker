document.addEventListener("DOMContentLoaded", function() {
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            pages.forEach(page => page.style.display = 'none');
            document.getElementById(button.id.replace('nav-', '')).style.display = 'block';
        });
    });

    document.getElementById('add-plant-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('plant-name').value;
        const growTime = document.getElementById('grow-time').value;
        const datePlanted = document.getElementById('date-planted').value;

        const plantList = document.querySelector('.plant-list');
        const newPlant = document.createElement('div');
        newPlant.classList.add('plant');
        newPlant.innerHTML = `
            <p>Name: ${name}</p>
            <p>Grow Time: ${growTime} weeks</p>
            <p>Date Planted: ${datePlanted}</p>
            <p>Watering: -- oz every -- days</p>
            <p>Nutrients: --</p>
            <button class="edit-plant">Edit</button>
        `;
        plantList.appendChild(newPlant);

        document.getElementById('add-plant-form').reset();
    });
});
