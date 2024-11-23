import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { auth } from './backend/firebase-config.js';

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
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Successfully signed in with Google:", user);
            
            // Close the auth modal
            const modal = document.getElementById('authModal');
            modal.style.display = 'none';
        })
        .catch((error) => {
            console.error("Error signing in with Google:", error);
            alert("Failed to sign in with Google. Please try again.");
        });
} 

async function handleLogin() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset previous error states
    emailInput.classList.remove('invalid');
    passwordInput.classList.remove('invalid');

    // Validate empty fields
    if (!email) {
        emailInput.classList.add('invalid');
        alert("Please enter your email address");
        return;
    }
    if (!password) {
        passwordInput.classList.add('invalid');
        alert("Please enter your password");
        return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailInput.classList.add('invalid');
        alert("Please enter a valid email address");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Successfully logged in:", userCredential.user);
        
        // Reset any error states on success
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        
        // Close the auth modal
        const modal = document.getElementById('authModal');
        modal.style.display = 'none';
    } catch (error) {
        console.error("Error logging in:", error.code, error.message);
        let errorMessage = "Failed to log in. ";
        
        switch (error.code) {
            case 'auth/invalid-email':
                emailInput.classList.add('invalid');
                errorMessage += "Invalid email format.";
                break;
            case 'auth/user-not-found':
                emailInput.classList.add('invalid');
                errorMessage += "No account exists with this email.";
                break;
            case 'auth/wrong-password':
                passwordInput.classList.add('invalid');
                errorMessage += "Incorrect password.";
                break;
            case 'auth/invalid-credential':
                emailInput.classList.add('invalid');
                passwordInput.classList.add('invalid');
                errorMessage += "Invalid email or password.";
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Successfully signed up:", userCredential.user);
        
        // Close the auth modal
        const modal = document.getElementById('authModal');
        modal.style.display = 'none';
    } catch (error) {
        console.error("Error signing up:", error);
        let errorMessage = "Failed to sign up. ";

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "This email is already registered.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email format.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage += "Email/password accounts are not enabled.";
                break;
            case 'auth/weak-password':
                errorMessage += "Password is too weak.";
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
    }
}

export { openLoginForm, openSignupForm, signInWithGoogle, handleLogin, handleSignup };
