// Admins Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadAdmins();
    setupAdminForm();
});

function loadAdmins() {
    const allAdmins = JSON.parse(localStorage.getItem('allAdmins') || '[]');
    const adminsTableBody = document.getElementById('adminsTableBody');
    
    if (allAdmins.length === 0) {
        adminsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #64748b;">No admins added yet.</td></tr>';
        return;
    }

    adminsTableBody.innerHTML = allAdmins.map(admin => `
        <tr>
            <td>${admin.name}</td>
            <td>${admin.username}</td>
            <td>${admin.email}</td>
            <td><span style="padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600; background: ${getRoleColor(admin.role)}; color: white;">${formatRole(admin.role)}</span></td>
            <td>${new Date(admin.createdAt).toLocaleDateString()}</td>
            <td>
                ${admin.role !== 'super_admin' ? `
                <button class="admin-btn admin-btn-danger" onclick="deleteAdmin('${admin.username}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                    <i class="fas fa-trash"></i> Delete
                </button>
                ` : '<span style="color: #64748b; font-size: 0.85rem;">Cannot delete super admin</span>'}
            </td>
        </tr>
    `).join('');
}

function setupAdminForm() {
    const adminForm = document.getElementById('addAdminForm');
    adminForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('adminName').value;
        const username = document.getElementById('adminUsername').value.trim();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const role = document.getElementById('adminRole').value;

        const newAdmin = {
            name: name,
            username: username,
            email: email,
            password: password, // In production, this should be hashed
            role: role,
            createdAt: new Date().toISOString()
        };

        const allAdmins = JSON.parse(localStorage.getItem('allAdmins') || '[]');
        
        // Check if admin already exists
        if (allAdmins.some(admin => admin.username === username)) {
            alert('An admin with this username already exists.');
            return;
        }
        
        if (allAdmins.some(admin => admin.email === email)) {
            alert('An admin with this email already exists.');
            return;
        }

        allAdmins.push(newAdmin);
        localStorage.setItem('allAdmins', JSON.stringify(allAdmins));

        alert(`Admin "${username}" created successfully! Share these credentials:\n\nUsername: ${username}\nPassword: ${password}`);
        adminForm.reset();
        loadAdmins();
    });
}

function getRoleColor(role) {
    switch(role) {
        case 'super_admin': return '#7c3aed';
        case 'admin': return '#2563eb';
        case 'moderator': return '#059669';
        default: return '#64748b';
    }
}

function formatRole(role) {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function deleteAdmin(username) {
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
        const allAdmins = JSON.parse(localStorage.getItem('allAdmins') || '[]');
        const updatedAdmins = allAdmins.filter(admin => admin.username !== username);
        localStorage.setItem('allAdmins', JSON.stringify(updatedAdmins));
        loadAdmins();
        alert('Admin deleted successfully.');
    }
}
