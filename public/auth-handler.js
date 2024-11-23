import { auth, googleProvider } from '../backend/firebase-config.js';
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const AUTH_API_URL = 'http://localhost:5500';

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

function signInWithGoogle() {
    // Redirect to backend auth endpoint
    window.location.href = `${AUTH_API_URL}/google`;
} 

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // Add validation similar to handleSignup
    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();
        // Handle successful login
        const modal = document.getElementById('authModal');
        modal.style.display = 'none';
        
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Failed to log in. Please try again.");
    }
}

async function handleSignup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    // Validate empty fields
    if (!email) {
        alert("Please enter your email address");
        return;
    }
    if (!password) {
        alert("Please enter your password");
        return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Password strength validation
    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    try {
        const response = await fetch(`${AUTH_API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // for handling cookies
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        const data = await response.json();
        console.log("Successfully signed up:", data);
        
        // Close the auth modal
        const modal = document.getElementById('authModal');
        modal.style.display = 'none';
    } catch (error) {
        console.error("Error signing up:", error);
        alert("Failed to sign up. Please try again.");
    }
}

async function handleGoogleSignIn() {
    try {
        // Add these settings to handle popup issues
        googleProvider.setCustomParameters({
            prompt: 'select_account',
            // Add these parameters to help with popup issues
            nonce: Math.random().toString(36).substring(2),
            state: Math.random().toString(36).substring(2)
        });

        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Get ID token instead of access token
        const idToken = await user.getIdToken();

        // Add logging to debug the request
        console.log('Sending request to:', `${AUTH_API_URL}/google-auth`);
        
        const response = await fetch(`${AUTH_API_URL}/google-auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                uid: user.uid
            })
        });

        // Add more detailed error logging
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Successfully authenticated with Google:", data);
        
        // Close the auth modal
        const modal = document.getElementById('authModal');
        if (modal) modal.style.display = 'none';

    } catch (error) {
        console.error("Detailed error:", error);
        console.error("Error with Google authentication:", error);
        if (error.code === 'auth/popup-closed-by-user') {
            alert("Google sign-in was cancelled. Please try again.");
        } else if (error.code === 'auth/popup-blocked') {
            alert("Popup was blocked. Please allow popups for this site and try again.");
        } else {
            alert(`Authentication failed: ${error.message}`);
        }
    }
}

// Add a Google sign-up button click handler (this will use the same flow)
function handleGoogleSignUp() {
    // Since Google handles both sign-in and sign-up in the same flow,
    // we can reuse the handleGoogleSignIn function
    return handleGoogleSignIn();
}

// Add a function to set up all event listeners
function setupAuthEventListeners() {
    // Close button
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';
        });
    }

    // Switch between forms
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'block';
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        });
    }

    // User menu setup
    setupUserMenu();
}

export { 
    openLoginForm,
    openSignupForm,
    handleLogin,
    handleSignup,
    handleGoogleSignIn,
    handleGoogleSignUp,
    setupAuthEventListeners
};
