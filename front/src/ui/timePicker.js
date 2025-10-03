export function timePicker() {
    
    const timeInput = document.getElementById('time-picker');
    if (!timeInput) return;
    // Initialize with current time if needed
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;
    // Function to handle time selection

    function updateSelectedDate(selectedTime) {
        const payload = { time: selectedTime };
        document.dispatchEvent(new CustomEvent('timeChanged', { detail: payload }));

        try {
            window.selectedTime = selectedTime;
        } catch (e) {
            // Ignora erros
        }   
        console.log("Time selected:", selectedTime);
    }

    timeInput.addEventListener('change', (event) => {
        const selectedTime = event.target.value;
        updateSelectedDate(selectedTime);
        alert("Time selected:", window.selectedTime);
    });

}