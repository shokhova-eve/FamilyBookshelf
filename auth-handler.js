function openLoginForm() {
    const modal = document.getElementById('authModal');
	const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
	// Close modal when clicking X
	closeBtn.onclick = function() {
		modal.style.display = 'none';
	}

	// Optional: Close modal when clicking outside of it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	}
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    modal.style.display = 'block';
}

function openSignupForm() {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    modal.style.display = 'block';
} 
