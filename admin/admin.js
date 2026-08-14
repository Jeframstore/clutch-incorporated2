// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load statistics
    loadAdminStats();
});

function loadAdminStats() {
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Get tutor assignments
    const tutorAssignments = JSON.parse(localStorage.getItem('tutorAssignments') || '{}');
    const uniqueTutors = new Set(Object.values(tutorAssignments));
    
    // Get tasks (if any)
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    
    // Calculate total revenue (sum of all user amounts)
    let totalRevenue = 0;
    allUsers.forEach(user => {
        totalRevenue += parseFloat(user.totalAmount || 0);
    });

    // Update stats display
    document.getElementById('totalUsers').textContent = allUsers.length;
    document.getElementById('totalTutors').textContent = uniqueTutors.size;
    document.getElementById('totalTasks').textContent = allTasks.length;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
}
