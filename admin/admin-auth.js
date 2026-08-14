// Admin Authentication Check
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Set admin name
    const adminName = localStorage.getItem('currentAdminName') || 'Admin';
    const adminUserNameElement = document.getElementById('adminUserName');
    if (adminUserNameElement) {
        adminUserNameElement.textContent = adminName;
    }

    // Logout functionality
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('currentAdminName');
            localStorage.removeItem('currentAdminEmail');
            localStorage.removeItem('currentAdminRole');
            window.location.href = 'login.html';
        });
    }
});
