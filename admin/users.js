// Users Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupSearch();
});

function loadUsers() {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const usersTableBody = document.getElementById('usersTableBody');
    
    if (allUsers.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #64748b;">No users registered yet.</td></tr>';
        return;
    }

    usersTableBody.innerHTML = allUsers.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.number}</td>
            <td>${user.invitationCode}</td>
            <td>$${user.totalAmount || '0.00'}</td>
            <td>${new Date(user.registeredAt).toLocaleDateString()}</td>
            <td>
                <button class="admin-btn admin-btn-primary" onclick="viewUser('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="admin-btn admin-btn-danger" onclick="deleteUser('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('userSearch');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.number.includes(searchTerm)
        );
        
        const usersTableBody = document.getElementById('usersTableBody');
        if (filteredUsers.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #64748b;">No users found matching your search.</td></tr>';
            return;
        }

        usersTableBody.innerHTML = filteredUsers.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.number}</td>
                <td>${user.invitationCode}</td>
                <td>$${user.totalAmount || '0.00'}</td>
                <td>${new Date(user.registeredAt).toLocaleDateString()}</td>
                <td>
                    <button class="admin-btn admin-btn-primary" onclick="viewUser('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="admin-btn admin-btn-danger" onclick="deleteUser('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    });
}

function viewUser(email) {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const user = allUsers.find(u => u.email === email);
    
    if (user) {
        alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nNumber: ${user.number}\nInvitation Code: ${user.invitationCode}\nTotal Amount: $${user.totalAmount || '0.00'}\nRegistered: ${new Date(user.registeredAt).toLocaleString()}`);
    }
}

function deleteUser(email) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const updatedUsers = allUsers.filter(u => u.email !== email);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
        
        // Also remove from tutor assignments
        const tutorAssignments = JSON.parse(localStorage.getItem('tutorAssignments') || '{}');
        delete tutorAssignments[email];
        localStorage.setItem('tutorAssignments', JSON.stringify(tutorAssignments));
        
        loadUsers();
        alert('User deleted successfully.');
    }
}
