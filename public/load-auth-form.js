async function loadAuthModal() {
    try {
        const response = await fetch('/auth-form.html');
        const html = await response.text();
        
        // Create a container for the auth modal
        const authContainer = document.createElement('div');
        authContainer.innerHTML = html;
        
        // Append it to the body
        document.body.appendChild(authContainer.firstChild);
        
    } catch (error) {
        console.error('Error loading auth modal:', error);
    }
}

export { loadAuthModal };
