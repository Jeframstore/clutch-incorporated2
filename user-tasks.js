// User Tasks JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentTask();
    setupSliderNavigation();
});

let dailyTasks = [];
let currentSlide = 0;
let slideData = {
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
    
    slideData.past = [];
    slideData.present = [];
    slideData.next = [];
    let hasNextTask = false;
    
    dailyTasks.forEach(task => {
        const taskStartTime = parseTime(task.startTime);
        const taskDuration = task.isPremium ? 50 : 20; // Premium: 50 mins, Normal: 20 mins
        const taskEndTime = new Date(taskStartTime.getTime() + taskDuration * 60 * 1000);
        
        console.log(`Task ${task.taskNumber}: Start: ${taskStartTime.toLocaleString()}, End: ${taskEndTime.toLocaleString()}`);
        
        // Categorize as past tasks (end time has passed)
        if (taskEndTime < currentTime) {
            slideData.past.push({ ...task, isAvailable: false, timePeriod: 'past' });
            console.log(`Task ${task.taskNumber}: PAST`);
        }
        // Categorize as present tasks (within task time window)
        else if (taskStartTime <= currentTime && taskEndTime >= currentTime) {
            slideData.present.push({ ...task, isAvailable: true, timePeriod: 'present' });
            console.log(`Task ${task.taskNumber}: PRESENT`);
        }
        // Categorize as next task (start time is in future, only one)
        else if (taskStartTime > currentTime && !hasNextTask) {
            slideData.next.push({ ...task, isAvailable: true, timePeriod: 'next' });
            hasNextTask = true;
            console.log(`Task ${task.taskNumber}: NEXT`);
        }
    });
    
    console.log('Past tasks:', slideData.past.map(t => ({ number: t.taskNumber })));
    console.log('Present tasks:', slideData.present.map(t => ({ number: t.taskNumber })));
    console.log('Next tasks:', slideData.next.map(t => ({ number: t.taskNumber })));

    // Display current slide
    updateSlide();
}

function setupSliderNavigation() {
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const indicators = document.querySelectorAll('.indicator');

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < 2) {
            currentSlide++;
            updateSlide();
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateSlide();
        });
    });
}

function updateSlide() {
    const slideLabel = document.getElementById('slideLabel');
    const taskSlide = document.getElementById('taskSlide');
    const indicators = document.querySelectorAll('.indicator');

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });

    // Update slide content based on current slide
    let tasks = [];
    let label = '';
    let timePeriod = '';
    let slideClass = '';

    switch(currentSlide) {
        case 0:
            tasks = slideData.past;
            label = 'Past Tasks';
            timePeriod = 'past';
            slideClass = 'past-slide';
            break;
        case 1:
            tasks = slideData.present;
            label = 'Present Task';
            timePeriod = 'present';
            slideClass = 'present-slide';
            break;
        case 2:
            tasks = slideData.next;
            label = 'Next Task';
            timePeriod = 'next';
            slideClass = 'next-slide';
            break;
    }

    slideLabel.textContent = label;
    taskSlide.className = `task-slide ${slideClass}`;

    if (tasks.length === 0) {
        if (timePeriod === 'past') {
            taskSlide.innerHTML = `
                <div class="empty-slide">
                    <i class="fas fa-history"></i>
                    <h3>No Past Tasks</h3>
                    <p>Tasks you've completed will appear here</p>
                </div>
            `;
        } else if (timePeriod === 'present') {
            taskSlide.innerHTML = `
                <div class="empty-slide">
                    <i class="fas fa-clock"></i>
                    <h3>No Active Task</h3>
                    <p>Check back when a task is scheduled</p>
                </div>
            `;
        } else if (timePeriod === 'next') {
            taskSlide.innerHTML = `
                <div class="empty-slide">
                    <i class="fas fa-forward"></i>
                    <h3>No Upcoming Tasks</h3>
                    <p>Your next task will appear here</p>
                </div>
            `;
        }
        return;
    }

    // Display tasks in slide
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
    
    taskSlide.innerHTML = tasksHTML;
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
