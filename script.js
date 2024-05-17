// script.js

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

function toggleArchivedTasks() {
    const sidebar = document.getElementById('archived-tasks-sidebar');
    sidebar.classList.toggle('open');
}

function toggleEditToolbar() {
    const toolbar = document.getElementById('edit-toolbar');
    toolbar.style.display = toolbar.style.display === 'none' ? 'block' : 'none';
}

function addNewTask(columnId) {
    const taskColumn = document.getElementById(columnId);
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.id = 'task' + Date.now(); // Unique ID for each task
    taskCard.draggable = true;
    taskCard.innerHTML = `
        <h3 contenteditable="true">New Task</h3>
        <p contenteditable="true">Description of the new task</p>
        <div class="subtasks">
            <div class="subtask">
                <input type="checkbox" onchange="updateProgress(this)">
                <label contenteditable="true">Subtask 1</label>
            </div>
        </div>
        <button class="add-subtask-button" onclick="addSubtask(this)">Add Subtask</button>
        <div class="task-info">
            <span class="difficulty" onclick="selectDifficulty(this)">Difficulty: Medium</span>
            <div class="progress-bar">
                <div class="progress" style="width: 0%;"></div>
            </div>
        </div>
    `;
    taskCard.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', taskCard.id);
    });

    // Insert the new task card before the add task button
    const addButton = taskColumn.querySelector('.add-task-btn');
    taskColumn.insertBefore(taskCard, addButton);
    taskColumn.scrollTop = taskColumn.scrollHeight; // Scroll to the bottom of the column
}

// Drag-and-Drop Functionality
document.querySelectorAll('.task-card').forEach(card => {
    card.draggable = true;
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.id);
    });
});

document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allows for dropping
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(id);

        // Check if the card element actually exists before appending
        if (card) {
            // Insert the dragged card before the add task button
            const addButton = column.querySelector('.add-task-btn');
            column.insertBefore(card, addButton);
        } else {
            console.error('Failed to find the dragged element');
        }
    });
});

function updateProgress(checkbox) {
    const taskCard = checkbox.closest('.task-card');
    const subtasks = taskCard.querySelectorAll('.subtasks input[type="checkbox"]');
    const completedSubtasks = taskCard.querySelectorAll('.subtasks input[type="checkbox"]:checked');
    const progress = (completedSubtasks.length / subtasks.length) * 100;
    taskCard.querySelector('.progress').style.width = progress + '%';
}

function addSubtask(button) {
    const taskCard = button.closest('.task-card');
    const subtasksDiv = taskCard.querySelector('.subtasks');
    const newSubtask = document.createElement('div');
    newSubtask.className = 'subtask';
    newSubtask.innerHTML = `
        <input type="checkbox" onchange="updateProgress(this)">
        <label contenteditable="true">New Subtask</label>
    `;
    subtasksDiv.appendChild(newSubtask);
    updateProgress(newSubtask.querySelector('input'));
}

function selectDifficulty(span) {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const currentDifficulty = span.textContent.split(': ')[1];
    const newDifficulty = difficulties[(difficulties.indexOf(currentDifficulty) + 1) % difficulties.length];
    span.textContent = 'Difficulty: ' + newDifficulty;
}

