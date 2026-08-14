// Settings Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadGeneralSettings();
    loadPlatformSettings();
    setupGeneralSettingsForm();
    setupPlatformSettingsForm();
});

function loadGeneralSettings() {
    const generalSettings = JSON.parse(localStorage.getItem('generalSettings') || '{}');
    
    if (generalSettings.siteName) {
        document.getElementById('siteName').value = generalSettings.siteName;
    }
    
    if (generalSettings.siteDescription) {
        document.getElementById('siteDescription').value = generalSettings.siteDescription;
    }
    
    if (generalSettings.contactEmail) {
        document.getElementById('contactEmail').value = generalSettings.contactEmail;
    }
    
    if (generalSettings.contactPhone) {
        document.getElementById('contactPhone').value = generalSettings.contactPhone;
    }
}

function loadPlatformSettings() {
    const platformSettings = JSON.parse(localStorage.getItem('platformSettings') || '{}');
    
    if (platformSettings.maintenanceMode !== undefined) {
        document.getElementById('maintenanceMode').value = platformSettings.maintenanceMode;
    }
    
    if (platformSettings.registrationStatus) {
        document.getElementById('registrationStatus').value = platformSettings.registrationStatus;
    }
    
    if (platformSettings.defaultCurrency) {
        document.getElementById('defaultCurrency').value = platformSettings.defaultCurrency;
    }
}

function setupGeneralSettingsForm() {
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    generalSettingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const siteName = document.getElementById('siteName').value;
        const siteDescription = document.getElementById('siteDescription').value;
        const contactEmail = document.getElementById('contactEmail').value;
        const contactPhone = document.getElementById('contactPhone').value;

        const generalSettings = {
            siteName: siteName,
            siteDescription: siteDescription,
            contactEmail: contactEmail,
            contactPhone: contactPhone,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
        alert('General settings saved successfully!');
    });
}

function setupPlatformSettingsForm() {
    const platformSettingsForm = document.getElementById('platformSettingsForm');
    platformSettingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const maintenanceMode = document.getElementById('maintenanceMode').value;
        const registrationStatus = document.getElementById('registrationStatus').value;
        const defaultCurrency = document.getElementById('defaultCurrency').value;

        const platformSettings = {
            maintenanceMode: maintenanceMode,
            registrationStatus: registrationStatus,
            defaultCurrency: defaultCurrency,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
        alert('Platform configuration saved successfully!');
    });
}

function exportData() {
    const allData = {
        allUsers: JSON.parse(localStorage.getItem('allUsers') || '[]'),
        allAdmins: JSON.parse(localStorage.getItem('allAdmins') || '[]'),
        allTasks: JSON.parse(localStorage.getItem('allTasks') || '[]'),
        tutorAssignments: JSON.parse(localStorage.getItem('tutorAssignments') || '{}'),
        customerServiceConfig: JSON.parse(localStorage.getItem('customerServiceConfig') || '{}'),
        generalSettings: JSON.parse(localStorage.getItem('generalSettings') || '{}'),
        platformSettings: JSON.parse(localStorage.getItem('platformSettings') || '{}'),
        exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clutch_admin_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone and will delete all users, admins, tasks, and settings.')) {
        if (confirm('This is your final warning. All data will be permanently deleted. Continue?')) {
            localStorage.clear();
            alert('All data has been cleared. You will be redirected to the authentication page.');
            window.location.href = '../auth.html';
        }
    }
}
