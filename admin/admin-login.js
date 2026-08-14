// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Check if admin is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize default super admin if not exists
    initializeDefaultAdmin();

    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Handle admin login form submission
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;

        // Get all admins
        const allAdmins = JSON.parse(localStorage.getItem('allAdmins') || '[]');
        
        // Find admin with matching credentials
        const admin = allAdmins.find(a => a.username === username && a.password === password);

        if (admin) {
            // Set admin session
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('currentAdminName', admin.name);
            localStorage.setItem('currentAdminEmail', admin.email);
            localStorage.setItem('currentAdminRole', admin.role);
            
            alert(`Welcome back, ${admin.name}!`);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } else {
            alert('Invalid admin credentials. Please try again.');
        }
    });
});

function initializeDefaultAdmin() {
    const allAdmins = JSON.parse(localStorage.getItem('allAdmins') || '[]');
    
    // Check if super admin already exists
    if (!allAdmins.some(admin => admin.username === 'superadmin')) {
        const defaultSuperAdmin = {
            name: 'Super Admin',
            email: 'superadmin@clutchinc.com',
            username: 'superadmin',
            password: 'admin123', // Default password - should be changed in production
            role: 'super_admin',
            createdAt: new Date().toISOString()
        };
        
        allAdmins.push(defaultSuperAdmin);
        localStorage.setItem('allAdmins', JSON.stringify(allAdmins));
        
        console.log('Default super admin created:');
        console.log('Username: superadmin');
        console.log('Password: admin123');
    }
}
