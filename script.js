document.getElementById('fetchDataBtn').addEventListener('click', fetchStationsData);

async function fetchStationsData() {
    const tableBody = document.getElementById('stations-table-body');
    const statusDiv = document.getElementById('status');

    // Wyczyść poprzednie dane i status
    tableBody.innerHTML = '';
    statusDiv.textContent = 'Pobieranie danych...';
    statusDiv.style.color = 'black';

    try {
        // ZMIANA: URL jest teraz prostszy i odnosi się bezpośrednio do endpointu proxy
        const proxyUrl = 'http://localhost:3000/stations?limit=100';

        // ZMIANA: Nie wysyłamy już żadnych nagłówków, bo proxy robi to za nas
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Błąd serwera: ${response.status} ${response.statusText}. Treść: ${errorText}`);
        }

        const data = await response.json();
        console.log('Otrzymane dane:', data);

        if (!data.results || data.results.length === 0) {
            statusDiv.textContent = 'Nie znaleziono żadnych stacji.';
            return;
        }

        data.results.forEach(station => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${station.id || 'Brak'}</td>
        <td>${station.name || 'Brak'}</td>
        <td>${station.latitude || 'Brak'}</td>
        <td>${station.longitude || 'Brak'}</td>
      `;
            tableBody.appendChild(row);
        });

        statusDiv.textContent = `Pomyślnie załadowano ${data.results.length} stacji.`;
        statusDiv.style.color = 'green';

    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania danych:', error);
        statusDiv.textContent = `Wystąpił błąd: ${error.message}. Sprawdź konsolę.`;
        statusDiv.style.color = 'red';
    }
}