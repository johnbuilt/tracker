document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');

    function loadHomePage() {
        mainContainer.innerHTML = `
            <h2>Today's Feedings:</h2>
            <div class="card">
                <p><strong>Plant Name:</strong> Tomato</p>
                <p><strong>Water Amount:</strong> 20 oz</p>
                <p><strong>Nutrients:</strong> Big Bloom, Grow Big</p>
            </div>
        `;
    }

    function loadAddPlantPage() {
        mainContainer.innerHTML = `
            <h2>Add Plant</h2>
            <form>
                <label for="plant-name">Name:</label>
                <input type="text" id="plant-name" name="plant-name">
                <label for="grow-time">Grow Time:</label>
                <input type="text" id="grow-time" name="grow-time">
                <label for="date-planted">Date Planted:</label>
                <input type="date" id="date-planted" name="date-planted">
                <button type="submit" class="center">Add Plant</button>
            </form>
        `;
    }

    function loadMyPlantsPage() {
        mainContainer.innerHTML = `
            <h2>My Plants</h2>
            <button class="center">Save</button>
            <button class="center">Import</button>
            <div class="card">
                <p><strong>Name:</strong> Tomato</p>
                <p><strong>Grow Time:</strong> 10 weeks</p>
                <p><strong>Date Planted:</strong> 2023-06-01</p>
                <p><strong>Watering:</strong> 20 oz every 2 days</p>
                <p><strong>Nutrients:</strong> Big Bloom, Grow Big</p>
                <button class="center">Edit</button>
            </div>
        `;
    }

    function loadSchedulePage() {
        mainContainer.innerHTML = `<h2>Schedule</h2>`;
    }

    function loadSettingsPage() {
        mainContainer.innerHTML = `<h2>Settings</h2>`;
    }

    const pages = {
        'home': loadHomePage,
        'add-plant': loadAddPlantPage,
        'my-plants': loadMyPlantsPage,
        'schedule': loadSchedulePage,
        'settings': loadSettingsPage
    };

    function navigateTo(hash) {
        const pageId = hash.replace('#', '') || 'home';
        if (pages[pageId]) {
            pages[pageId]();
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`);
            });
        }
    }

    window.addEventListener('hashchange', () => navigateTo(location.hash));
    navigateTo(location.hash);
});
