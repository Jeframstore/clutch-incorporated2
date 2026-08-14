// Auth Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Check if user is already authenticated
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'home.html';
        return;
    }

    // Toggle between Login and Register forms
    loginToggle.addEventListener('click', function() {
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerToggle.addEventListener('click', function() {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
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

    // Handle form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add login logic here
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const userCode = document.getElementById('loginUserCode').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        console.log('Login attempt:', { email, password, userCode, rememberMe });
        
        // Simulate successful login (replace with actual authentication)
        localStorage.setItem('isAuthenticated', 'true');
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        }
        
        alert('Login successful! Redirecting to home page...');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add registration logic here
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const number = document.getElementById('registerNumber').value;
        const password = document.getElementById('registerPassword').value;
        const invitationCode = document.getElementById('registerInvitationCode').value;
        const codeSendMethod = document.querySelector('input[name="codeSendMethod"]:checked').value;

        console.log('Registration attempt:', { name, email, number, password, invitationCode, codeSendMethod });
        
        // Simulate successful registration (replace with actual registration)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userNumber', number);
        localStorage.setItem('userInvitationCode', invitationCode);
        localStorage.setItem('userTotalAmount', '0.00'); // Initialize with 0
        localStorage.setItem('userPassword', password);

        // Store user in allUsers array for admin panel
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        allUsers.push({
            name: name,
            email: email,
            number: number,
            invitationCode: invitationCode,
            totalAmount: '0.00',
            registeredAt: new Date().toISOString()
        });
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        alert('Registration successful! Redirecting to home page...');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    });
});
