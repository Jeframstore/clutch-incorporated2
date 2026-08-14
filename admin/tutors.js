// Tutors Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadTutorAssignments();
    setupTutorForm();
});

function loadUsers() {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const tutorUserSelect = document.getElementById('tutorUserSelect');
    
    allUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.email;
        option.textContent = `${user.name} (${user.email})`;
        tutorUserSelect.appendChild(option);
    });
}

function loadTutorAssignments() {
    const tutorAssignments = JSON.parse(localStorage.getItem('tutorAssignments') || '{}');
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const tutorAssignmentsTableBody = document.getElementById('tutorAssignmentsTableBody');
    
    const assignments = Object.entries(tutorAssignments).map(([userEmail, tutorUsername]) => {
        const user = allUsers.find(u => u.email === userEmail);
        return {
            userEmail: userEmail,
            userName: user ? user.name : userEmail,
            tutorUsername: tutorUsername
        };
    });

    if (assignments.length === 0) {
        tutorAssignmentsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b;">No tutor assignments yet.</td></tr>';
        return;
    }

    tutorAssignmentsTableBody.innerHTML = assignments.map(assignment => `
        <tr>
            <td>${assignment.userName}</td>
            <td>${assignment.userEmail}</td>
            <td>@${assignment.tutorUsername}</td>
            <td>
                <a href="https://t.me/${assignment.tutorUsername}" target="_blank" class="admin-btn admin-btn-primary" style="padding: 0.5rem 0.75rem; font-size: 0.85rem; text-decoration: none;">
                    <i class="fab fa-telegram"></i> Open Telegram
                </a>
            </td>
            <td>
                <button class="admin-btn admin-btn-danger" onclick="removeTutor('${assignment.userEmail}')" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </td>
        </tr>
    `).join('');
}

function setupTutorForm() {
    const tutorForm = document.getElementById('assignTutorForm');
    tutorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userEmail = document.getElementById('tutorUserSelect').value;
        const tutorUsername = document.getElementById('tutorUsername').value.trim();

        if (!userEmail || !tutorUsername) {
            alert('Please select a user and enter tutor username');
            return;
        }

        const tutorAssignments = JSON.parse(localStorage.getItem('tutorAssignments') || '{}');
        tutorAssignments[userEmail] = tutorUsername;
        localStorage.setItem('tutorAssignments', JSON.stringify(tutorAssignments));

        alert(`Tutor @${tutorUsername} assigned to ${userEmail}`);
        tutorForm.reset();
        loadTutorAssignments();
    });
}

function removeTutor(userEmail) {
    if (confirm('Are you sure you want to remove this tutor assignment?')) {
        const tutorAssignments = JSON.parse(localStorage.getItem('tutorAssignments') || '{}');
        delete tutorAssignments[userEmail];
        localStorage.setItem('tutorAssignments', JSON.stringify(tutorAssignments));
        loadTutorAssignments();
        alert('Tutor assignment removed successfully.');
    }
}
