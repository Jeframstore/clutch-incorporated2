// Edit Profile JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Load current user data
    const userName = localStorage.getItem('userName') || '';
    const userEmail = localStorage.getItem('userEmail') || '';
    const userNumber = localStorage.getItem('userNumber') || '';
    const userInvitationCode = localStorage.getItem('userInvitationCode') || '';

    document.getElementById('editName').value = userName;
    document.getElementById('editEmail').value = userEmail;
    document.getElementById('editNumber').value = userNumber;
    document.getElementById('editInvitationCode').value = userInvitationCode;

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
        
        const newName = document.getElementById('editName').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        const newNumber = document.getElementById('editNumber').value.trim();
        const newInvitationCode = document.getElementById('editInvitationCode').value.trim();
        const currentPassword = document.getElementById('editCurrentPassword').value;
        const newPassword = document.getElementById('editNewPassword').value;
        const confirmPassword = document.getElementById('editConfirmPassword').value;

        // Get current user data from allUsers to verify password
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const userIndex = allUsers.findIndex(u => u.email === userEmail);
        
        if (userIndex === -1) {
            alert('User not found. Please contact support.');
            return;
        }

        // Check if password change is requested
        if (newPassword || confirmPassword) {
            if (!currentPassword) {
                alert('Please enter your current password to change your password.');
                return;
            }
            
            if (currentPassword !== allUsers[userIndex].password) {
                alert('Current password is incorrect.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('New password and confirm password do not match.');
                return;
            }
            
            if (newPassword.length < 6) {
                alert('New password must be at least 6 characters long.');
                return;
            }
        }

        // Update localStorage
        localStorage.setItem('userName', newName);
        localStorage.setItem('userEmail', newEmail);
        localStorage.setItem('userNumber', newNumber);
        localStorage.setItem('userInvitationCode', newInvitationCode);

        // Update in allUsers array as well
        allUsers[userIndex].name = newName;
        allUsers[userIndex].email = newEmail;
        allUsers[userIndex].number = newNumber;
        allUsers[userIndex].invitationCode = newInvitationCode;
        
        // Update password if changed
        if (newPassword) {
            allUsers[userIndex].password = newPassword;
        }
        
        localStorage.setItem('allUsers', JSON.stringify(allUsers));

        // Update tutor assignments if email changed
        if (newEmail !== userEmail) {
            const tutorAssignments = JSON.parse(localStorage.getItem('tutorAssignments') || '{}');
            if (tutorAssignments[userEmail]) {
                tutorAssignments[newEmail] = tutorAssignments[userEmail];
                delete tutorAssignments[userEmail];
                localStorage.setItem('tutorAssignments', JSON.stringify(tutorAssignments));
            }
        }

        alert('Profile updated successfully!');
        
        // Redirect to profile page
        window.location.href = 'profile.html';
    });
});
