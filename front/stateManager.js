// O estado centralizado da aplicação.
const appState = {
    date: null,
    location: null
};

document.addEventListener('calendarDateChanged', (event) => {
    appState.date = event.detail;
    checkAndProcessData();
});

document.addEventListener('locationFound', (event) => {
    appState.location = event.detail;
    checkAndProcessData();
});

export function getAppState() {
    return appState;
}
export function getDate() {
    return appState.date;
}

export function getLocation() {
    return appState.location;
}

export function checkAndProcessData() {
    if (appState.date && appState.location) {
        console.log("Todos os dados foram recebidos:");
        console.log("Data:", appState);
        // Coloque aqui a lógica para fazer a busca na API
    }
}