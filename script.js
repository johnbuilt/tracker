document.addEventListener("DOMContentLoaded", function() {
    const content = document.getElementById('content');

    const routes = {
        "#new-plant": `
            <form id="plant-form">
                <label for="plant-name">Plant Name:</label>
                <input type="text" id="plant-name" required>
                <label for="plant-date">Planting Date:</label>
                <input type="date" id="plant-date" required>
                <label for="plant-grow-time">Grow Time (weeks):</label>
                <input type="number" id="plant-grow-time" required>
                <label for="plant-photo">Upload Photo:</label>
                <input type="file" id="plant-photo" accept="image/*">
                <button type="submit">Add Plant</button>
            </form>
        `,
        "#my-plants": `
            <button onclick="importPlants()">Import Plants</button>
            <button onclick="savePlantsToFile()">Save Plants to File</button>
            <ul id="plants"></ul>
        `,
        "#schedule": `
            <div>Schedule</div>
        `,
        "#settings": `
            <div>Settings</div>
        `
    };

    function loadRoute(route) {
        content.innerHTML = routes[route] || routes["#new-plant"];
    }

    window.addEventListener('hashchange', function() {
        loadRoute(location.hash);
    });

    // Load initial route
    loadRoute(location.hash || "#new-plant");
});

function importPlants() {
    // Implement import functionality
}

function savePlantsToFile() {
    // Implement save functionality
}
