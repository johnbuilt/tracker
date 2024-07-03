document.addEventListener('DOMContentLoaded', function() {
    showPage('new-plant');  // Show the 'New Plant' page by default

    // Plant form submission
    document.getElementById('plant-form').addEventListener('submit', function(event) {
        event.preventDefault();
        addPlant();
    });

    // Handle file input change for importing plants
    document.getElementById('import-file').addEventListener('change', function(event) {
        handleImport(event);
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(page) {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function addPlant() {
    // Your existing addPlant logic here
}

function importPlants() {
    document.getElementById('import-file').click();
}

function handleImport(event) {
    // Your existing handleImport logic here
}

function savePlantsToFile() {
    // Your existing savePlantsToFile logic here
}
