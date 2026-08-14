// Customer Service Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCustomerServiceConfig();
    setupCustomerServiceForm();
});

function loadCustomerServiceConfig() {
    const customerServiceConfig = JSON.parse(localStorage.getItem('customerServiceConfig') || '{}');
    
    if (customerServiceConfig.telegram) {
        document.getElementById('customerServiceTelegram').value = customerServiceConfig.telegram;
        document.getElementById('displayTelegram').textContent = `@${customerServiceConfig.telegram}`;
        // Update the Telegram link
        const telegramLink = document.querySelector('a[href*="t.me"]');
        if (telegramLink) {
            telegramLink.href = `https://t.me/${customerServiceConfig.telegram}`;
        }
    }
    
    if (customerServiceConfig.status) {
        document.getElementById('customerServiceStatus').value = customerServiceConfig.status;
        document.getElementById('displayStatus').textContent = customerServiceConfig.status.charAt(0).toUpperCase() + customerServiceConfig.status.slice(1);
    }
    
    if (customerServiceConfig.hours) {
        document.getElementById('customerServiceHours').value = customerServiceConfig.hours;
        document.getElementById('displayHours').textContent = customerServiceConfig.hours;
    }
}

function setupCustomerServiceForm() {
    const customerServiceForm = document.getElementById('customerServiceForm');
    customerServiceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const telegram = document.getElementById('customerServiceTelegram').value.trim();
        const status = document.getElementById('customerServiceStatus').value;
        const hours = document.getElementById('customerServiceHours').value;

        const customerServiceConfig = {
            telegram: telegram,
            status: status,
            hours: hours,
            updatedAt: new Date().toISOString(),
            isGlobal: true // Mark as global customer service
        };

        console.log('Saving customer service config:', customerServiceConfig);
        localStorage.setItem('customerServiceConfig', JSON.stringify(customerServiceConfig));
        console.log('Saved to localStorage. Current value:', localStorage.getItem('customerServiceConfig'));

        // Update display
        document.getElementById('displayTelegram').textContent = `@${telegram}`;
        document.getElementById('displayStatus').textContent = status.charAt(0).toUpperCase() + status.slice(1);
        document.getElementById('displayHours').textContent = hours;
        
        // Update the Telegram link
        const telegramLink = document.querySelector('a[href*="t.me"]');
        if (telegramLink) {
            telegramLink.href = `https://t.me/${telegram}`;
        }

        alert('Customer service settings saved successfully! This will be the permanent customer service for all users.');
    });
}
