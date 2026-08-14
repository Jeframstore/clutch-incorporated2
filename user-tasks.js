// User Tasks JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentTask();
    setupTaskButtons();
});

let dailyTasks = [];
let currentCategory = 'past';
let taskData = {
    past: [],
    present: [],
    next: []
};

function getEasternTime() {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    return easternTime;
}

function loadCurrentTask() {
    dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    console.log('Loaded dailyTasks:', dailyTasks);
    
    if (dailyTasks.length === 0) {
        document.getElementById('pastTasks').innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No tasks available.</div>';
        document.getElementById('presentTask').innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No tasks available.</div>';
        document.getElementById('nextTask').innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No tasks available.</div>';
        console.log('No tasks found in localStorage');
        return;
    }

    // Categorize tasks into past, present, and next
    const currentTime = getEasternTime();
    console.log('Current Eastern Time:', currentTime.toLocaleString());
    
    taskData.past = [];
    taskData.present = [];
    taskData.next = [];
    let hasNextTask = false;
    
    dailyTasks.forEach(task => {
        const taskStartTime = parseTime(task.startTime);
        const taskDuration = task.isPremium ? 50 : 20; // Premium: 50 mins, Normal: 20 mins
        const taskEndTime = new Date(taskStartTime.getTime() + taskDuration * 60 * 1000);
        
        console.log(`Task ${task.taskNumber}: Start: ${taskStartTime.toLocaleString()}, End: ${taskEndTime.toLocaleString()}`);
        
        // Categorize as past tasks (end time has passed)
        if (taskEndTime < currentTime) {
            taskData.past.push({ ...task, isAvailable: false, timePeriod: 'past' });
            console.log(`Task ${task.taskNumber}: PAST`);
        }
        // Categorize as present tasks (within task time window)
        else if (taskStartTime <= currentTime && taskEndTime >= currentTime) {
            taskData.present.push({ ...task, isAvailable: true, timePeriod: 'present' });
            console.log(`Task ${task.taskNumber}: PRESENT`);
        }
        // Categorize as next task (start time is in future, only one)
        else if (taskStartTime > currentTime && !hasNextTask) {
            taskData.next.push({ ...task, isAvailable: true, timePeriod: 'next' });
            hasNextTask = true;
            console.log(`Task ${task.taskNumber}: NEXT`);
        }
    });
    
    console.log('Past tasks:', taskData.past.map(t => ({ number: t.taskNumber })));
    console.log('Present tasks:', taskData.present.map(t => ({ number: t.taskNumber })));
    console.log('Next tasks:', taskData.next.map(t => ({ number: t.taskNumber })));

    // Display current category
    displayCategory(currentCategory);
}

function setupTaskButtons() {
    const taskButtons = document.querySelectorAll('.task-btn');

    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            currentCategory = category;
            
            // Update active button
            taskButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Display tasks for selected category
            displayCategory(category);
        });
    });
}

function displayCategory(category) {
    const taskContent = document.getElementById('taskContent');
    let tasks = [];
    let timePeriod = '';
    let bgColor = '';

    switch(category) {
        case 'past':
            tasks = taskData.past;
            timePeriod = 'past';
            bgColor = 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
            break;
        case 'present':
            tasks = taskData.present;
            timePeriod = 'present';
            bgColor = 'linear-gradient(135deg, #eff6ff, #dbeafe)';
            break;
        case 'next':
            tasks = taskData.next;
            timePeriod = 'next';
            bgColor = 'linear-gradient(135deg, #f0fdf4, #dcfce7)';
            break;
    }

    if (tasks.length === 0) {
        if (timePeriod === 'past') {
            taskContent.innerHTML = `
                <div class="empty-category" style="background: ${bgColor};">
                    <i class="fas fa-history"></i>
                    <h3>No Past Tasks</h3>
                    <p>Tasks you've completed will appear here</p>
                </div>
            `;
        } else if (timePeriod === 'present') {
            taskContent.innerHTML = `
                <div class="empty-category" style="background: ${bgColor};">
                    <i class="fas fa-clock"></i>
                    <h3>No Active Task</h3>
                    <p>Check back when a task is scheduled</p>
                </div>
            `;
        } else if (timePeriod === 'next') {
            taskContent.innerHTML = `
                <div class="empty-category" style="background: ${bgColor};">
                    <i class="fas fa-forward"></i>
                    <h3>No Upcoming Tasks</h3>
                    <p>Your next task will appear here</p>
                </div>
            `;
        }
        return;
    }

    // Display tasks
    let tasksHTML = '';
    
    tasks.forEach(task => {
        const taskBgColor = getTaskBackgroundColor(task, timePeriod);
        const borderColor = task.isPremium ? '#f59e0b' : '#2563eb';
        const isDisabled = !task.isAvailable;
        
        let taskDetails = '';
        
        if (task.isPremium) {
            taskDetails = `
                <div class="single-task-card ${isDisabled ? 'task-disabled' : ''}" style="background: ${taskBgColor}; border-left: 4px solid ${borderColor};">
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
                <div class="single-task-card ${isDisabled ? 'task-disabled' : ''}" style="background: ${taskBgColor}; border-left: 4px solid ${borderColor};">
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
        
        tasksHTML += taskDetails;
    });
    
    taskContent.innerHTML = tasksHTML;
}

function displayTasksInSection(sectionId, tasks, timePeriod) {
    console.log(`Displaying tasks in section ${sectionId}, count: ${tasks.length}`);
    const section = document.getElementById(sectionId);
    
    if (!section) {
        console.error(`Section with ID ${sectionId} not found`);
        return;
    }
    
    if (tasks.length === 0) {
        if (timePeriod === 'past') {
            section.innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No past tasks yet.</div>';
        } else if (timePeriod === 'present') {
            section.innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No active task at this time.</div>';
        } else if (timePeriod === 'next') {
            section.innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No upcoming tasks today.</div>';
        }
        return;
    }

    let tasksHTML = '';
    
    tasks.forEach(task => {
        const bgColor = getTaskBackgroundColor(task, timePeriod);
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
        
        tasksHTML += taskDetails;
    });
    
    section.innerHTML = tasksHTML;
    console.log(`Updated section ${sectionId} with ${tasks.length} tasks`);
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
