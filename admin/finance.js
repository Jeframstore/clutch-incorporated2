// Finance JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
    loadUsers();
    setupTransactionForm();
    loadStats();
    handleUrlParameters();
});

function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('user');
    const type = urlParams.get('type');

    if (userEmail) {
        document.getElementById('transactionUser').value = userEmail;
    }

    if (type) {
        document.getElementById('transactionType').value = type;
    }
}

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const tableBody = document.getElementById('transactionsTable');
    
    if (transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #64748b;">No transactions found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${transaction.userName} (${transaction.userEmail})</td>
            <td>
                <span class="admin-badge ${transaction.type === 'deposit' ? 'admin-badge-success' : 'admin-badge-danger'}">
                    ${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </span>
            </td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td>${new Date(transaction.date).toLocaleString()}</td>
            <td>
                <span class="admin-badge ${getStatusBadgeClass(transaction.status)}">
                    ${transaction.status}
                </span>
            </td>
            <td>
                ${transaction.status === 'pending' ? `
                    <button class="admin-btn admin-btn-success" onclick="approveTransaction('${transaction.id}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="admin-btn admin-btn-danger" onclick="rejectTransaction('${transaction.id}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : `
                    <button class="admin-btn admin-btn-secondary" onclick="deleteTransaction('${transaction.id}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'pending': return 'admin-badge-warning';
        case 'approved': return 'admin-badge-success';
        case 'rejected': return 'admin-badge-danger';
        case 'completed': return 'admin-badge-success';
        default: return 'admin-badge-secondary';
    }
}

function loadUsers() {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userSelect = document.getElementById('transactionUser');
    
    allUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.email;
        option.textContent = `${user.name} (${user.email})`;
        userSelect.appendChild(option);
    });
}

function setupTransactionForm() {
    const form = document.getElementById('addTransactionForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userEmail = document.getElementById('transactionUser').value;
        const type = document.getElementById('transactionType').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const notes = document.getElementById('transactionNotes').value;
        
        if (!userEmail || !amount) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Get user details
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const user = allUsers.find(u => u.email === userEmail);
        
        if (!user) {
            alert('User not found');
            return;
        }
        
        // Create transaction
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const transaction = {
            id: Date.now().toString(),
            userEmail: userEmail,
            userName: user.name,
            type: type,
            amount: amount,
            notes: notes,
            status: 'pending',
            date: new Date().toISOString()
        };
        
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Clear form
        form.reset();
        
        // Reload transactions and stats
        loadTransactions();
        loadStats();
        
        alert('Transaction added successfully!');
    });
}

function approveTransaction(id) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transactionIndex = transactions.findIndex(t => t.id === id);
    
    if (transactionIndex === -1) {
        alert('Transaction not found');
        return;
    }
    
    const transaction = transactions[transactionIndex];
    
    // Update transaction status
    transactions[transactionIndex].status = 'approved';
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Update user balance
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.email === transaction.userEmail);
    
    if (userIndex !== -1) {
        if (transaction.type === 'deposit') {
            allUsers[userIndex].totalAmount = (parseFloat(allUsers[userIndex].totalAmount) || 0) + transaction.amount;
        } else if (transaction.type === 'withdrawal') {
            allUsers[userIndex].totalAmount = (parseFloat(allUsers[userIndex].totalAmount) || 0) - transaction.amount;
        }
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
    
    // Reload transactions and stats
    loadTransactions();
    loadStats();
    
    alert('Transaction approved and user balance updated!');
}

function rejectTransaction(id) {
    if (!confirm('Are you sure you want to reject this transaction?')) {
        return;
    }
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transactionIndex = transactions.findIndex(t => t.id === id);
    
    if (transactionIndex === -1) {
        alert('Transaction not found');
        return;
    }
    
    transactions[transactionIndex].status = 'rejected';
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Reload transactions and stats
    loadTransactions();
    loadStats();
    
    alert('Transaction rejected!');
}

function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const updatedTransactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Reload transactions and stats
    loadTransactions();
    loadStats();
    
    alert('Transaction deleted!');
}

function loadStats() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    const totalDeposits = transactions
        .filter(t => t.type === 'deposit' && (t.status === 'approved' || t.status === 'completed'))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = transactions
        .filter(t => t.type === 'withdrawal' && (t.status === 'approved' || t.status === 'completed'))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingRequests = transactions.filter(t => t.status === 'pending').length;
    const completedTransactions = transactions.filter(t => t.status === 'approved' || t.status === 'completed').length;
    
    document.getElementById('totalDeposits').textContent = `$${totalDeposits.toFixed(2)}`;
    document.getElementById('totalWithdrawals').textContent = `$${totalWithdrawals.toFixed(2)}`;
    document.getElementById('pendingRequests').textContent = pendingRequests;
    document.getElementById('completedTransactions').textContent = completedTransactions;
}
