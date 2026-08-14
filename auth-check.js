// Authentication Check for Protected Pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'auth.html';
        return;
    }
});
