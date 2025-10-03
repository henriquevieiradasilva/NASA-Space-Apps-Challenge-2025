export async function fetchCoordinates(city) {
    
    const url = `/api/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

    try{
        const response = await fetch(url, {
            headers: 
                { 'User-Agent': 'WillItRainOnMyParade/1.0' }
        });
    
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }
    
        return null;
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}
