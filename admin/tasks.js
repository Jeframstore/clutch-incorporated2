// Tasks Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupTaskReset();
    initializeDefaultTasks();
    setupTaskNavigation();
    setupTaskModal();
    loadTasks('present');
});

// Eastern Time functions
function getEasternTime() {
    // Check if there's a manual time override
    const timeOverride = localStorage.getItem('timeOverride');
    if (timeOverride) {
        return new Date(timeOverride);
    }
    
    const now = new Date();
    const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    return easternTime;
}

function getCurrentDateInEastern() {
    const easternTime = getEasternTime();
    return easternTime.toISOString().split('T')[0];
}

function setupTaskReset() {
    const resetBtn = document.getElementById('resetTasksBtn');
    const dateDisplay = document.getElementById('taskDateDisplay');
    const timeOverrideInput = document.getElementById('timeOverride');
    const clearTimeOverrideBtn = document.getElementById('clearTimeOverride');
    
    // Display current Eastern Time date
    updateDateDisplay();
    
    // Set initial time override value if exists
    const existingOverride = localStorage.getItem('timeOverride');
    if (existingOverride) {
        timeOverrideInput.value = existingOverride;
    }
    
    // Time override change handler
    timeOverrideInput.addEventListener('change', () => {
        const newTime = timeOverrideInput.value;
        if (newTime) {
            localStorage.setItem('timeOverride', newTime);
            updateDateDisplay();
            loadTasks('present'); // Reload tasks with new time
        }
    });
    
    // Clear time override handler
    clearTimeOverrideBtn.addEventListener('click', () => {
        localStorage.removeItem('timeOverride');
        timeOverrideInput.value = '';
        updateDateDisplay();
        loadTasks('present'); // Reload tasks with real time
    });
    
    resetBtn.addEventListener('click', () => {
        const currentEasternDate = getCurrentDateInEastern();
        const storedDate = localStorage.getItem('taskDate');
        
        if (storedDate === currentEasternDate) {
            alert('Tasks are already set for today in Eastern Time. You can edit existing tasks.');
            return;
        }
        
        if (confirm(`Reset tasks for new day: ${currentEasternDate}? This will create fresh tasks for the new day.`)) {
            resetTasksForNewDate(currentEasternDate);
        }
    });
}

function updateDateDisplay() {
    const dateDisplay = document.getElementById('taskDateDisplay');
    const currentDate = getCurrentDateInEastern();
    const timeOverride = localStorage.getItem('timeOverride');
    
    if (timeOverride) {
        dateDisplay.textContent = `Override Time (Eastern): ${currentDate.toLocaleString()}`;
    } else {
        dateDisplay.textContent = `Current Date (Eastern Time): ${currentDate}`;
    }
}

function resetTasksForNewDate(date) {
    let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    
    dailyTasks = defaultTasks.map(task => {
        const taskData = {
            taskNumber: task.taskNumber,
            startTime: task.startTime,
            isPremium: task.isPremium,
            photo: null
        };

        if (task.isPremium) {
            taskData.premiumNumber = task.premiumNumber;
            taskData.premiumAnnouncement = defaultPremiumTask.premiumAnnouncement;
            taskData.earnings = defaultPremiumTask.earnings;
            taskData.premiumDescription = defaultPremiumTask.premiumDescription;
            taskData.importantNote = defaultPremiumTask.importantNote;
        } else {
            taskData.taskName = defaultNormalTask.taskName;
            taskData.taskDuration = defaultNormalTask.taskDuration;
            taskData.instructions = defaultNormalTask.instructions;
            taskData.bonus = defaultNormalTask.bonus;
            taskData.importantNote = defaultNormalTask.importantNote;
        }

        return taskData;
    });

    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
    localStorage.setItem('taskDate', date);
    
    loadTasks('present');
    alert(`Tasks reset successfully for ${date}. You can now edit them.`);
}

// Default task structure with 24 tasks
const defaultTasks = [
    { taskNumber: 1, startTime: '9:30', isPremium: false },
    { taskNumber: 2, startTime: '9:50', isPremium: false },
    { taskNumber: 3, startTime: '10:10', isPremium: false },
    { taskNumber: 4, startTime: '10:30', isPremium: true, premiumNumber: 1 },
    { taskNumber: 5, startTime: '11:20', isPremium: false },
    { taskNumber: 6, startTime: '11:40', isPremium: false },
    { taskNumber: 7, startTime: '12:00', isPremium: false },
    { taskNumber: 8, startTime: '12:20', isPremium: true, premiumNumber: 2 },
    { taskNumber: 9, startTime: '13:10', isPremium: false },
    { taskNumber: 10, startTime: '13:30', isPremium: false },
    { taskNumber: 11, startTime: '13:50', isPremium: false },
    { taskNumber: 12, startTime: '14:10', isPremium: true, premiumNumber: 3 },
    { taskNumber: 13, startTime: '15:00', isPremium: false },
    { taskNumber: 14, startTime: '15:20', isPremium: false },
    { taskNumber: 15, startTime: '15:40', isPremium: false },
    { taskNumber: 16, startTime: '16:00', isPremium: true, premiumNumber: 4 },
    { taskNumber: 17, startTime: '16:50', isPremium: false },
    { taskNumber: 18, startTime: '17:10', isPremium: false },
    { taskNumber: 19, startTime: '17:30', isPremium: false },
    { taskNumber: 20, startTime: '17:50', isPremium: true, premiumNumber: 5 },
    { taskNumber: 21, startTime: '18:40', isPremium: false },
    { taskNumber: 22, startTime: '19:00', isPremium: false },
    { taskNumber: 23, startTime: '19:20', isPremium: false },
    { taskNumber: 24, startTime: '19:40', isPremium: true, premiumNumber: 6 }
];

const defaultNormalTask = {
    taskName: 'XXX',
    taskDuration: '20 minutes',
    instructions: `▶️Step 1: Find a picture of a "XXX" in your phone's photo album
▶️Step 2: Include the task number when posting to ensure it's correct
▶️Step 3: Post it in the current group with the caption 💬`,
    bonus: 'Complete 24 missions in a row and earn 450 USDC!',
    importantNote: `1. The manager will calculate your reward. 2. 📸Don't forget to send your screenshots to claim your rewards`
};

const defaultPremiumTask = {
    premiumAnnouncement: `We are recruiting a few external collaborators to complete tasks that boost system activity, trading depth, and data stability during the market validation phase.`,
    earnings: `Once the premium order transaction is completed, you can also earn 30%-50% commission.

Seize this opportunity to earn while supporting premium data enhancement.`,
    premiumDescription: `💥 Option 1: 50 USDT cashback - 65 USDT (30% New Member Benefit, can only be chosen once).
🚀Option 2: 100 USDT cashback - 130 USDT (30%)
💥Option 3: 250 USDT cashback - 325 USDT(30%)
🚀Option 4: 450 USDT cashback - 630 USDT (40%)
💥Option 5: 980 USDT cashback - 1372 USDT (40%)
🚀Option 6: 1280 USDT cashback - 1792 USDT (40%)
💥Option 7: 3980 USDT cashback - 5572 USDT (4%)
🚀Option 8: 5270 USDT cashback - 7378 USDT (40%)
💥Option 9: 8890 USDT cashback - 13335 USDT (50%)`,
    importantNote: `Prepaid fees are required! Rest assured, your safety is guaranteed! 
For more details, please consult the receptionist. 

Get ready to seize this opportunity! Remember, screenshots must be submitted, and don't hesitate to reach out to the receptionist if you have any questions. Let's make this endeavor a resounding success! 

If you encounter any issues with your work, please contact your assigned receptionist!`
};

function initializeDefaultTasks() {
    const currentEasternDate = getCurrentDateInEastern();
    const storedDate = localStorage.getItem('taskDate');
    let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    
    // Check if we need to reset tasks for a new day in Eastern Time
    if (storedDate !== currentEasternDate || dailyTasks.length === 0) {
        dailyTasks = defaultTasks.map(task => {
            const taskData = {
                taskNumber: task.taskNumber,
                startTime: task.startTime,
                isPremium: task.isPremium,
                photo: null
            };

            if (task.isPremium) {
                taskData.premiumNumber = task.premiumNumber;
                taskData.premiumAnnouncement = defaultPremiumTask.premiumAnnouncement;
                taskData.earnings = defaultPremiumTask.earnings;
                taskData.premiumDescription = defaultPremiumTask.premiumDescription;
                taskData.importantNote = defaultPremiumTask.importantNote;
            } else {
                taskData.taskName = defaultNormalTask.taskName;
                taskData.taskDuration = defaultNormalTask.taskDuration;
                taskData.instructions = defaultNormalTask.instructions;
                taskData.bonus = defaultNormalTask.bonus;
                taskData.importantNote = defaultNormalTask.importantNote;
            }

            return taskData;
        });

        localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
        localStorage.setItem('taskDate', currentEasternDate);
    }
}

function setupTaskNavigation() {
    const pastBtn = document.getElementById('pastTasksBtn');
    const presentBtn = document.getElementById('presentTasksBtn');
    const nextBtn = document.getElementById('nextTasksBtn');

    pastBtn.addEventListener('click', () => {
        setActiveButton(pastBtn);
        loadTasks('past');
    });

    presentBtn.addEventListener('click', () => {
        setActiveButton(presentBtn);
        loadTasks('present');
    });

    nextBtn.addEventListener('click', () => {
        setActiveButton(nextBtn);
        loadTasks('next');
    });
}

function setActiveButton(activeBtn) {
    document.querySelectorAll('.task-nav-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function loadTasks(timePeriod) {
    const dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    const taskGrid = document.getElementById('taskGrid');
    const currentTime = new Date();
    
    if (dailyTasks.length === 0) {
        taskGrid.innerHTML = `<div style="text-align: center; color: #64748b; padding: 2rem;">No tasks available.</div>`;
        return;
    }
    
    let filteredTasks = [];
    
    if (timePeriod === 'past') {
        filteredTasks = dailyTasks.filter(task => {
            const taskTime = parseTime(task.startTime);
            return taskTime < currentTime;
        });
    } else if (timePeriod === 'present') {
        filteredTasks = dailyTasks.filter(task => {
            const taskTime = parseTime(task.startTime);
            const timeDiff = (taskTime - currentTime) / (1000 * 60 * 60); // hours difference
            return timeDiff >= -1 && timeDiff <= 1; // Within 1 hour
        });
    } else if (timePeriod === 'next') {
        filteredTasks = dailyTasks.filter(task => {
            const taskTime = parseTime(task.startTime);
            const timeDiff = (taskTime - currentTime) / (1000 * 60 * 60); // hours difference
            return timeDiff > 1;
        });
    }

    if (filteredTasks.length === 0) {
        taskGrid.innerHTML = `<div style="text-align: center; color: #64748b; padding: 2rem;">No ${timePeriod} tasks available.</div>`;
        return;
    }

    taskGrid.innerHTML = '';
    filteredTasks.forEach(task => {
        taskGrid.appendChild(createTaskCard(task, timePeriod));
    });
}

function parseTime(timeStr) {
    const today = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const taskTime = new Date(today.setHours(hours, minutes, 0, 0));
    return taskTime;
}

function createTaskCard(task, timePeriod) {
    const bgColor = getTaskBackgroundColor(task, timePeriod);
    const borderColor = task.isPremium ? '#f59e0b' : '#2563eb';
    
    const card = document.createElement('div');
    card.className = 'task-card';
    card.style.background = bgColor;
    card.style.borderLeft = `4px solid ${borderColor}`;
    card.style.cursor = 'pointer';
    
    card.innerHTML = `
        <div class="task-card-header">
            <span class="task-number">Task ${task.taskNumber}</span>
            <span class="task-start-time">${task.startTime}</span>
            ${task.isPremium ? '<span class="premium-badge">Premium</span>' : ''}
        </div>
        ${task.photo ? `<div class="task-photo"><img src="${task.photo}" alt="Task photo"></div>` : '<div class="task-photo-placeholder"><i class="fas fa-image"></i><span>No photo</span></div>'}
        <div class="task-card-body">
            <h3>${task.isPremium ? `Premium Task ${task.premiumNumber}` : task.taskName}</h3>
            <p><strong>Duration:</strong> ${task.taskDuration || '20 minutes'}</p>
            ${!task.isPremium ? `<p><strong>Bonus:</strong> ${task.bonus}</p>` : ''}
        </div>
    `;
    
    card.addEventListener('click', () => openTaskModal(task.taskNumber));
    
    return card;
}

function getTaskBackgroundColor(task, timePeriod) {
    if (task.isPremium) {
        return 'linear-gradient(135deg, #fef3c7, #fde68a)';
    }
    
    switch(timePeriod) {
        case 'past':
            return 'linear-gradient(135deg, #e5e7eb, #d1d5db)';
        case 'present':
            return 'linear-gradient(135deg, #dbeafe, #bfdbfe)';
        case 'next':
            return 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
        case 'all':
            return 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
        default:
            return '#f8fafc';
    }
}

function setupTaskModal() {
    const modal = document.getElementById('taskModal');
    const closeBtn = document.getElementById('taskModalClose');
    const cancelBtn = document.getElementById('cancelTaskEdit');
    const photoUpload = document.getElementById('photoUpload');
    const photoInput = document.getElementById('taskPhoto');
    const taskEditForm = document.getElementById('taskEditForm');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    photoUpload.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoPreview = document.getElementById('photoPreview');
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Task photo">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Add clipboard paste support
    photoUpload.addEventListener('paste', function(e) {
        e.preventDefault();
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoPreview = document.getElementById('photoPreview');
                    photoPreview.innerHTML = `<img src="${e.target.result}" alt="Task photo">`;
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
    });

    // Make the entire document handle paste when modal is open
    document.addEventListener('paste', function(e) {
        if (modal.style.display === 'block') {
            const items = e.clipboardData.items;
            
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photoPreview = document.getElementById('photoPreview');
                        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Task photo">`;
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        }
    });

    taskEditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });

    // XXX replacement logic
    document.getElementById('taskName').addEventListener('input', function() {
        const taskName = this.value || 'XXX';
        const instructions = document.getElementById('taskInstructions');
        const defaultInstructions = `▶️Step 1: Find a picture of a "XXX" in your phone's photo album
▶️Step 2: Include the task number when posting to ensure it's correct
▶️Step 3: Post it in the current group with the caption 💬`;
        
        instructions.value = defaultInstructions.replace(/XXX/g, taskName);
    });
}

function openTaskModal(taskNumber) {
    const dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    const task = dailyTasks.find(t => t.taskNumber === taskNumber);
    
    if (!task) return;

    const modal = document.getElementById('taskModal');
    const premiumFields = document.getElementById('premiumTaskFields');
    
    // Fill form with task data
    document.getElementById('taskNumber').value = task.taskNumber;
    document.getElementById('taskName').value = task.taskName || '';
    document.getElementById('taskDuration').value = task.taskDuration || '20 minutes';
    document.getElementById('taskInstructions').value = task.instructions || '';
    document.getElementById('taskBonus').value = task.bonus || '';
    document.getElementById('taskImportantNote').value = task.importantNote || '';

    if (task.isPremium) {
        premiumFields.style.display = 'block';
        document.getElementById('premiumTaskNumber').value = task.premiumNumber || '';
        document.getElementById('premiumAnnouncement').value = task.premiumAnnouncement || '';
        document.getElementById('premiumEarnings').value = task.earnings || '';
        document.getElementById('premiumDescription').value = task.premiumDescription || '';
    } else {
        premiumFields.style.display = 'none';
    }

    // Handle photo preview
    const photoPreview = document.getElementById('photoPreview');
    if (task.photo) {
        photoPreview.innerHTML = `<img src="${task.photo}" alt="Task photo">`;
    } else {
        photoPreview.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><span>Click to upload photo</span>`;
    }

    modal.style.display = 'block';
}

function saveTask() {
    const taskNumber = parseInt(document.getElementById('taskNumber').value);
    const dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    const taskIndex = dailyTasks.findIndex(t => t.taskNumber === taskNumber);
    
    if (taskIndex === -1) return;

    const task = dailyTasks[taskIndex];
    
    // Get photo data
    const photoPreview = document.getElementById('photoPreview');
    const imgElement = photoPreview.querySelector('img');
    if (imgElement) {
        task.photo = imgElement.src;
    }

    // Update task data
    task.taskName = document.getElementById('taskName').value;
    task.taskDuration = document.getElementById('taskDuration').value;
    task.instructions = document.getElementById('taskInstructions').value;
    task.bonus = document.getElementById('taskBonus').value;
    task.importantNote = document.getElementById('taskImportantNote').value;

    if (task.isPremium) {
        task.premiumNumber = document.getElementById('premiumTaskNumber').value;
        task.premiumAnnouncement = document.getElementById('premiumAnnouncement').value;
        task.earnings = document.getElementById('premiumEarnings').value;
        task.premiumDescription = document.getElementById('premiumDescription').value;
    }

    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
    
    alert('Task saved successfully!');
    document.getElementById('taskModal').style.display = 'none';
    
    // Reload current view
    const activeBtn = document.querySelector('.task-nav-btn.active');
    if (activeBtn.id === 'pastTasksBtn') loadTasks('past');
    else if (activeBtn.id === 'presentTasksBtn') loadTasks('present');
    else loadTasks('next');
}
