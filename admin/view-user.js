// View User JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadUserDetails();
    setupBackButton();
    setupPasswordForm();
});

function loadUserDetails() {
    // Get user email from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email');
    
    if (!userEmail) {
        document.getElementById('userDetails').innerHTML = '<p style="color: #ef4444;">No user specified. Please go back to the users page.</p>';
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const user = allUsers.find(u => u.email === userEmail);
    
    if (!user) {
        document.getElementById('userDetails').innerHTML = '<p style="color: #ef4444;">User not found.</p>';
        return;
    }

    // Display user details
    document.getElementById('userDetails').innerHTML = `
        <div style="padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #64748b; margin-bottom: 0.5rem;">Name</h4>
            <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">${user.name}</p>
        </div>
        <div style="padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #64748b; margin-bottom: 0.5rem;">Email</h4>
            <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">${user.email}</p>
        </div>
        <div style="padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #64748b; margin-bottom: 0.5rem;">Number</h4>
            <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">${user.number}</p>
        </div>
        <div style="padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #64748b; margin-bottom: 0.5rem;">Invitation Code</h4>
            <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">${user.invitationCode}</p>
        </div>
        <div style="padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #64748b; margin-bottom: 0.5rem;">Total Amount</h4>
            <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">$${user.totalAmount || '0.00'}</p>
        </div>
        <div style="padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #64748b; margin-bottom: 0.5rem;">Current Password</h4>
            <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">${user.password}</p>
        </div>
        <div style="padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <h4 style="color: #64748b; margin-bottom: 0.5rem;">Registered Date</h4>
            <p style="font-size: 1.1rem; font-weight: 600; margin: 0;">${new Date(user.registeredAt).toLocaleString()}</p>
        </div>
    `;
}

function setupBackButton() {
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', function() {
        window.location.href = 'users.html';
    });
}

function setupPasswordForm() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    changePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters long.');
            return;
        }
        
        // Get user email from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get('email');
        
        if (!userEmail) {
            alert('User not specified.');
            return;
        }
        
        // Update password in allUsers
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const userIndex = allUsers.findIndex(u => u.email === userEmail);
        
        if (userIndex === -1) {
            alert('User not found.');
            return;
        }
        
        allUsers[userIndex].password = newPassword;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        // Clear form
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Update displayed password
        loadUserDetails();
        
        alert('Password changed successfully!');
    });
}
