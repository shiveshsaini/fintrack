// Check if we are on the Login or Signup page
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Function to handle the redirect
function handleAuth(e) {
    e.preventDefault(); // Stop the form from reloading
    
    // In a real app, we would check passwords here.
    // For Phase 1/2, we just redirect to the dashboard.
    
    // Optional: Add a small delay for a "loading" effect
    const btn = e.target.querySelector('.btn');
    const originalText = btn.innerText;
    btn.innerText = 'Loading...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000); // 1 second delay
}

// Add event listeners if the forms exist
if (loginForm) {
    loginForm.addEventListener('submit', handleAuth);
}

if (signupForm) {
    signupForm.addEventListener('submit', handleAuth);
}