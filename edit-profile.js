// Edit Profile JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Load current user data
    const userEmail = localStorage.getItem('userEmail') || '';
    const userNumber = localStorage.getItem('userNumber') || '';

    document.getElementById('editEmail').value = userEmail;
    document.getElementById('editNumber').value = userNumber;

    // Back button functionality
    backBtn.addEventListener('click', function() {
        window.location.href = 'profile.html';
    });

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

    // Handle form submission
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('editEmail').value;
        const number = document.getElementById('editNumber').value;
        const currentPassword = document.getElementById('editCurrentPassword').value;
        const newPassword = document.getElementById('editNewPassword').value;
        const confirmPassword = document.getElementById('editConfirmPassword').value;

        // Validate password change if new password is provided
        if (newPassword && newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        // Update user data in localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userNumber', number);

        if (newPassword) {
            localStorage.setItem('userPassword', newPassword);
        }

        alert('Profile updated successfully!');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 500);
    });
});
