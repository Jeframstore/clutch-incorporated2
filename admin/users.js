// Users Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupSearch();
    setupBalanceModal();
});

let selectedUserEmail = null;

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
                <button class="admin-btn admin-btn-success" onclick="openBalanceModal('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                    <i class="fas fa-dollar-sign"></i> Balance
                </button>
                <button class="admin-btn admin-btn-info" onclick="addDeposit('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                    <i class="fas fa-arrow-down"></i> Deposit
                </button>
                <button class="admin-btn admin-btn-warning" onclick="addWithdrawal('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                    <i class="fas fa-arrow-up"></i> Withdraw
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
                    <button class="admin-btn admin-btn-success" onclick="openBalanceModal('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-dollar-sign"></i> Balance
                    </button>
                    <button class="admin-btn admin-btn-info" onclick="addDeposit('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-arrow-down"></i> Deposit
                    </button>
                    <button class="admin-btn admin-btn-warning" onclick="addWithdrawal('${user.email}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-arrow-up"></i> Withdraw
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
    window.location.href = `view-user.html?email=${encodeURIComponent(email)}`;
}

function addDeposit(email) {
    window.location.href = `finance.html?user=${encodeURIComponent(email)}&type=deposit`;
}

function addWithdrawal(email) {
    window.location.href = `finance.html?user=${encodeURIComponent(email)}&type=withdrawal`;
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

function setupBalanceModal() {
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addBalanceBtn = document.getElementById('addBalanceBtn');
    const subtractBalanceBtn = document.getElementById('subtractBalanceBtn');
    const balanceModal = document.getElementById('balanceModal');

    closeModalBtn.addEventListener('click', () => {
        balanceModal.style.display = 'none';
        selectedUserEmail = null;
    });

    addBalanceBtn.addEventListener('click', () => {
        updateBalance('add');
    });

    subtractBalanceBtn.addEventListener('click', () => {
        updateBalance('subtract');
    });

    // Close modal when clicking outside
    balanceModal.addEventListener('click', (e) => {
        if (e.target === balanceModal) {
            balanceModal.style.display = 'none';
            selectedUserEmail = null;
        }
    });
}

function openBalanceModal(email) {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const user = allUsers.find(u => u.email === email);
    
    if (user) {
        selectedUserEmail = email;
        document.getElementById('modalUserName').textContent = user.name;
        document.getElementById('modalUserEmail').textContent = user.email;
        document.getElementById('modalCurrentBalance').textContent = `$${user.totalAmount || '0.00'}`;
        document.getElementById('balanceAmount').value = '';
        document.getElementById('balanceModal').style.display = 'flex';
    }
}

function updateBalance(action) {
    const amount = parseFloat(document.getElementById('balanceAmount').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.email === selectedUserEmail);
    
    if (userIndex === -1) {
        alert('User not found');
        return;
    }

    const currentBalance = parseFloat(allUsers[userIndex].totalAmount) || 0;
    let newBalance;

    if (action === 'add') {
        newBalance = currentBalance + amount;
    } else if (action === 'subtract') {
        newBalance = currentBalance - amount;
        if (newBalance < 0) {
            if (!confirm('This will make the balance negative. Continue?')) {
                return;
            }
        }
    }

    allUsers[userIndex].totalAmount = newBalance.toFixed(2);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Update the user's localStorage as well
    localStorage.setItem('userTotalAmount', newBalance.toFixed(2));

    // Update modal display
    document.getElementById('modalCurrentBalance').textContent = `$${newBalance.toFixed(2)}`;
    document.getElementById('balanceAmount').value = '';

    // Refresh the users table
    loadUsers();

    alert(`Successfully ${action === 'add' ? 'added' : 'subtracted'} $${amount.toFixed(2)} to ${allUsers[userIndex].name}'s balance. New balance: $${newBalance.toFixed(2)}`);
}
