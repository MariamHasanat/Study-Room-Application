// Personalized greeting logic
export function setGreeting(greetingDiv, userData) {
    if (greetingDiv && userData && userData.name) {
        const hour = new Date().getHours();
        let greet = "Hello";
        if (hour < 12) greet = "Good morning";
        else if (hour < 18) greet = "Good afternoon";
        else greet = "Good evening";
        greetingDiv.textContent = `${greet}, ${userData.name} 👋🏆!`;
    }
}
