// User Tasks JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupTaskNavigation();
    loadCurrentTask();
});

let currentTaskIndex = 0;
let dailyTasks = [];
let availableTasks = [];

function setupTaskNavigation() {
    const prevBtn = document.getElementById('prevTaskBtn');
    const nextBtn = document.getElementById('nextTaskBtn');

    prevBtn.addEventListener('click', () => {
        if (currentTaskIndex > 0) {
            currentTaskIndex--;
            loadCurrentTask();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentTaskIndex < availableTasks.length - 1) {
            currentTaskIndex++;
            loadCurrentTask();
        }
    });
}

function getEasternTime() {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    return easternTime;
}

function loadCurrentTask() {
    dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    
    if (dailyTasks.length === 0) {
        document.getElementById('taskDisplay').innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No tasks available.</div>';
        return;
    }

    // Filter available tasks: all past, present, and one next task
    const currentTime = getEasternTime();
    console.log('Current Eastern Time:', currentTime.toLocaleString());
    
    availableTasks = [];
    let hasNextTask = false;
    
    dailyTasks.forEach(task => {
        const taskStartTime = parseTime(task.startTime);
        const taskDuration = task.isPremium ? 50 : 20; // Premium: 50 mins, Normal: 20 mins
        const taskEndTime = new Date(taskStartTime.getTime() + taskDuration * 60 * 1000);
        
        console.log(`Task ${task.taskNumber}: Start: ${taskStartTime.toLocaleString()}, End: ${taskEndTime.toLocaleString()}`);
        
        // Include all past tasks (end time has passed)
        if (taskEndTime < currentTime) {
            availableTasks.push({ ...task, isAvailable: false, timePeriod: 'past' });
            console.log(`Task ${task.taskNumber}: PAST`);
        }
        // Include present tasks (within task time window)
        else if (taskStartTime <= currentTime && taskEndTime >= currentTime) {
            availableTasks.push({ ...task, isAvailable: true, timePeriod: 'present' });
            console.log(`Task ${task.taskNumber}: PRESENT`);
        }
        // Include only one next task (start time is in future)
        else if (taskStartTime > currentTime && !hasNextTask) {
            availableTasks.push({ ...task, isAvailable: true, timePeriod: 'next' });
            hasNextTask = true;
            console.log(`Task ${task.taskNumber}: NEXT`);
        }
    });
    
    console.log('Available tasks:', availableTasks.map(t => ({ number: t.taskNumber, period: t.timePeriod })));

    // Check if all tasks are expired (end of day)
    const allExpired = availableTasks.every(task => task.timePeriod === 'past');
    
    if (availableTasks.length === 0) {
        document.getElementById('taskDisplay').innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No available tasks at this time.</div>';
        return;
    }

    // Show end of day message if all tasks are expired
    if (allExpired) {
        document.getElementById('taskDisplay').innerHTML = `
            <div class="end-of-day-message">
                <i class="fas fa-check-circle"></i>
                <h3>Thank you for today's task</h3>
                <p>Rest well and wait for tomorrow</p>
            </div>
        `;
        document.getElementById('prevTaskBtn').disabled = true;
        document.getElementById('nextTaskBtn').disabled = true;
        document.getElementById('currentTaskNumber').textContent = '0';
        document.getElementById('totalTasks').textContent = '0';
        return;
    }

    // Reset index if out of bounds
    if (currentTaskIndex >= availableTasks.length) {
        currentTaskIndex = availableTasks.length - 1;
    }

    // Update task counter
    document.getElementById('currentTaskNumber').textContent = currentTaskIndex + 1;
    document.getElementById('totalTasks').textContent = availableTasks.length;

    // Get current task
    const task = availableTasks[currentTaskIndex];
    const taskDisplay = document.getElementById('taskDisplay');
    
    const bgColor = getTaskBackgroundColor(task, task.timePeriod);
    const borderColor = task.isPremium ? '#f59e0b' : '#2563eb';
    const isDisabled = !task.isAvailable;
    
    let taskDetails = '';
    
    if (task.isPremium) {
        taskDetails = `
            <div class="single-task-card ${isDisabled ? 'task-disabled' : ''}" style="background: ${bgColor}; border-left: 4px solid ${borderColor};">
                <div class="task-card-header">
                    <span class="task-number">Task ${task.taskNumber}</span>
                    <span class="task-start-time">${task.startTime}</span>
                    <span class="premium-badge">Premium</span>
                    ${isDisabled ? '<span class="task-status-badge">Expired</span>' : ''}
                </div>
                ${task.photo ? `<div class="task-photo"><img src="${task.photo}" alt="Task photo"></div>` : '<div class="task-photo-placeholder"><i class="fas fa-image"></i><span>No photo</span></div>'}
                <div class="task-card-body">
                    <h3>Premium Task ${task.premiumNumber}</h3>
                    <div class="task-detail-section">
                        <h4>Task Number</h4>
                        <p>${task.taskNumber}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Premium Task Number</h4>
                        <p>${task.premiumNumber}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Task Duration</h4>
                        <p>${task.taskDuration || '50 minutes'}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Premium Announcement</h4>
                        <p>${task.premiumAnnouncement}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Earnings</h4>
                        <p>${task.earnings}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Premium Description</h4>
                        <p>${task.premiumDescription}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Important Note</h4>
                        <p>${task.importantNote}</p>
                    </div>
                    ${isDisabled ? '<div class="task-disabled-message"><i class="fas fa-lock"></i> This task has expired and is no longer available.</div>' : ''}
                </div>
            </div>
        `;
    } else {
        taskDetails = `
            <div class="single-task-card ${isDisabled ? 'task-disabled' : ''}" style="background: ${bgColor}; border-left: 4px solid ${borderColor};">
                <div class="task-card-header">
                    <span class="task-number">Task ${task.taskNumber}</span>
                    <span class="task-start-time">${task.startTime}</span>
                    ${isDisabled ? '<span class="task-status-badge">Expired</span>' : ''}
                </div>
                ${task.photo ? `<div class="task-photo"><img src="${task.photo}" alt="Task photo"></div>` : '<div class="task-photo-placeholder"><i class="fas fa-image"></i><span>No photo</span></div>'}
                <div class="task-card-body">
                    <h3>${task.taskName}</h3>
                    <div class="task-detail-section">
                        <h4>Task Number</h4>
                        <p>${task.taskNumber}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Task Name</h4>
                        <p>${task.taskName}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Task Duration</h4>
                        <p>${task.taskDuration || '20 minutes'}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Instructions</h4>
                        <p>${task.instructions}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Bonus</h4>
                        <p>${task.bonus}</p>
                    </div>
                    <div class="task-detail-section">
                        <h4>Important Note</h4>
                        <p>${task.importantNote}</p>
                    </div>
                    ${isDisabled ? '<div class="task-disabled-message"><i class="fas fa-lock"></i> This task has expired and is no longer available.</div>' : ''}
                </div>
            </div>
        `;
    }
    
    taskDisplay.innerHTML = taskDetails;
    
    // Update navigation buttons state
    document.getElementById('prevTaskBtn').disabled = currentTaskIndex === 0;
    document.getElementById('nextTaskBtn').disabled = currentTaskIndex === availableTasks.length - 1;
}

function parseTime(timeStr) {
    const easternTime = getEasternTime();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const taskTime = new Date(easternTime);
    taskTime.setHours(hours, minutes, 0, 0);
    return taskTime;
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
        default:
            return '#f8fafc';
    }
}
