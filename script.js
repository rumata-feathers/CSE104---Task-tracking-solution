let archivedTasks = [];
let current_edit_card = null;

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.classList.remove(`${currentTheme}-theme`);
    document.body.classList.add(`${newTheme}-theme`);

    localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.theme-toggle-btn').addEventListener('click', toggleTheme);

    // Load the saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`${savedTheme}-theme`);
});

function toggleArchivedTasks() {
    const sidebar = document.getElementById('archived-tasks-sidebar');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    } else {
        sidebar.classList.add('open');
        displayArchivedTasks();
    }
}

function addNewTask(columnId) {
    const taskColumn = document.getElementById(columnId);
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card new';
    taskCard.id = 'task' + Date.now();
    taskCard.draggable = true;
    taskCard.innerHTML = `
        <button class="task-btn archive-btn" onclick="archiveTask('${taskCard.id}')">
            <img src="logos/Archive Minimalistic Icon.svg" alt="Archive" />
        </button>
        <button class="task-btn delete-btn" onclick="deleteTask('${taskCard.id}')">
            <img src="logos/Delete icon.svg" alt="Delete" />
        </button>
        <h3 contenteditable="true" data-index="title">New Task</h3>
        <p contenteditable="true" data-index="description">Description of the new task</p>
        <div class="subtasks">
            <div class="subtask">
                <input type="checkbox" data-index="subtask-0">
                <label contenteditable="true" data-index="subtask-0">Subtask 1</label>
            </div>
        </div>
        <button class="add-subtask-button">Add Subtask</button>
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

    taskCard.addEventListener('dblclick', () => {
        synchronizeForward(taskCard.id);
        openSidebar(taskCard.id);
    });

    taskCard.querySelector('[data-index="title"]').addEventListener('input', () => {
        synchronizeForward(taskCard.id);
    });

    taskCard.querySelector('[data-index="description"]').addEventListener('input', () => {
        synchronizeForward(taskCard.id);
    });

    taskCard.querySelectorAll('.subtasks [contenteditable]').forEach(subtask => {
        subtask.addEventListener('input', () => {
            synchronizeForward(taskCard.id);
        });
    });

    taskCard.querySelector('span').addEventListener('click', () => {
        synchronizeForward(taskCard.id);
    });

    taskCard.querySelectorAll('.add-subtask-button').forEach(button => {
        button.addEventListener('click', () => {
            addSubtask(button, true);
            synchronizeForward(taskCard.id);
        });
    });

    taskCard.querySelectorAll('.subtasks input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateProgress(taskCard.id, true);
            synchronizeForward(taskCard.id);
        });
    });

    const addButton = taskColumn.querySelector('.add-task-btn');
    taskColumn.insertBefore(taskCard, addButton);
    taskColumn.scrollTop = taskColumn.scrollHeight;

    setTimeout(() => {
        taskCard.classList.remove('new');
    }, 300);
}

function closeSidebar() {
    const sidebar = document.getElementById('task-details-sidebar');
    sidebar.classList.remove('open');
    current_edit_card = null;
}

function archiveTask(taskId) {
    const taskCard = document.getElementById(taskId);
    if (taskCard) {
        const deleteDate = new Date().toLocaleString();
        const checkboxes = Array.from(taskCard.querySelectorAll('.subtasks input[type="checkbox"]')).map(cb => ({
            checked: cb.checked,
            label: cb.nextElementSibling.textContent
        }));
        archivedTasks.push({
            id: taskCard.id,
            content: taskCard.innerHTML,
            deleteDate: deleteDate,
            checkboxes: checkboxes
        });
        taskCard.remove();

        if (document.getElementById('archived-tasks-sidebar').classList.contains('open')) {
            displayArchivedTasks();
        }
        closeSidebar();
    }
}

function deleteTask(taskId) {
    const taskCard = document.getElementById(taskId);
    if (taskCard) {
        taskCard.remove();
    }

    archivedTasks = archivedTasks.filter(task => task.id !== taskId);

    if (document.getElementById('archived-tasks-sidebar').classList.contains('open')) {
        displayArchivedTasks();
    }
    closeSidebar();
}

function displayArchivedTasks() {
    const archivedTasksList = document.getElementById('archived-tasks-list');
    archivedTasksList.innerHTML = '';
    archivedTasks.forEach(task => {
        const archivedTaskCard = document.createElement('div');
        archivedTaskCard.className = 'task-card';
        archivedTaskCard.id = task.id;

        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = task.content;

        task.checkboxes.forEach((cb, index) => {
            const checkbox = tempDiv.querySelectorAll('.subtasks input[type="checkbox"]')[index];
            if (checkbox && cb.checked) {
                checkbox.setAttribute('checked', 'checked');
            }
        });

        archivedTaskCard.innerHTML = `
            ${tempDiv.innerHTML}
            <div class="delete-date">Deleted on: ${task.deleteDate}</div>
        `;

        const archiveBtn = archivedTaskCard.querySelector('.archive-btn');
        if (archiveBtn) archiveBtn.remove();
        const deleteBtn = archivedTaskCard.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.remove();

        archivedTasksList.appendChild(archivedTaskCard);
    });
}

document.querySelectorAll('.task-card').forEach(card => {
    card.draggable = true;
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.id);
    });
});

document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(id);

        if (card) {
            const addButton = column.querySelector('.add-task-btn');
            column.insertBefore(card, addButton);
        } else {
            console.error('Failed to find the dragged element');
        }
    });
});

function updateProgress(taskId, forward = true) {
    var taskCard = document.getElementById('task-details-content');
    if (forward) {
        taskCard = document.getElementById(taskId);
    }
    const subtasks = taskCard.querySelectorAll('.subtasks input[type="checkbox"]');
    const completedSubtasks = taskCard.querySelectorAll('.subtasks input[type="checkbox"]:checked');
    const progress = (completedSubtasks.length / subtasks.length) * 100;
    taskCard.querySelector('.progress').style.width = progress + '%';
}

function selectDifficulty(span) {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const currentDifficulty = span.textContent.split(': ')[1];
    const newDifficulty = difficulties[(difficulties.indexOf(currentDifficulty) + 1) % difficulties.length];
    span.textContent = 'Difficulty: ' + newDifficulty;
}

function openSidebar(taskId) {
    const sidebar = document.getElementById('task-details-sidebar');
    const taskDetailsContent = document.getElementById('task-details-content');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = current_edit_card.content;

    const archiveBtn = tempDiv.querySelector('.archive-btn');
    const deleteBtn = tempDiv.querySelector('.delete-btn');
    if (archiveBtn) archiveBtn.remove();
    if (deleteBtn) deleteBtn.remove();

    taskDetailsContent.innerHTML = tempDiv.innerHTML;
    sidebar.classList.add('open');

    taskDetailsContent.querySelectorAll('[contenteditable]').forEach(element => {
        element.addEventListener('input', () => {
            current_edit_card.content = taskDetailsContent.innerHTML;
            synchronizeBackward(taskId);
        });
    });
    taskDetailsContent.querySelectorAll('input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', () => {
            if (element.checked) {
                element.setAttribute('checked', 'checked');
            } else {
                element.removeAttribute('checked');
            }
            updateProgress(taskId, false);
            current_edit_card.content = taskDetailsContent.innerHTML;
            synchronizeBackward(taskId);
        });
    });
    taskDetailsContent.querySelector('span').addEventListener('click', () => {
        current_edit_card.content = taskDetailsContent.innerHTML;
        synchronizeBackward(taskId);
    });
    taskDetailsContent.querySelectorAll('.add-subtask-button').forEach(button => {
        button.addEventListener('click', () => {
            addSubtask(button, false);
            current_edit_card.content = taskDetailsContent.innerHTML;
            synchronizeBackward(taskId);
        });
    });
}

function synchronizeForward(taskId) {
    const taskCard = document.getElementById(taskId);
    taskCard.querySelectorAll('input[type="checkbox"]').forEach(element => {
        if (element.checked) {
            element.setAttribute('checked', 'checked');
        } else {
            element.removeAttribute('checked');
        }
    });
    current_edit_card = {
        id: taskCard.id,
        content: taskCard.innerHTML
    };
    if (document.getElementById('task-details-sidebar').classList.contains('open')) {
        openSidebar(taskId);
    }
}

function synchronizeBackward(taskId) {
    const taskCard = document.getElementById(taskId);

    const currentArchiveBtn = taskCard.querySelector('.archive-btn');
    const currentDeleteBtn = taskCard.querySelector('.delete-btn');

    const archiveBtnHTML = currentArchiveBtn ? currentArchiveBtn.outerHTML : null;
    const deleteBtnHTML = currentDeleteBtn ? currentDeleteBtn.outerHTML : null;

    if (currentArchiveBtn) currentArchiveBtn.remove();
    if (currentDeleteBtn) currentDeleteBtn.remove();

    taskCard.innerHTML = current_edit_card.content;

    if (archiveBtnHTML) taskCard.insertAdjacentHTML('afterbegin', archiveBtnHTML);
    if (deleteBtnHTML) taskCard.insertAdjacentHTML('afterbegin', deleteBtnHTML);

    taskCard.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', taskCard.id);
    });

    taskCard.addEventListener('dblclick', () => {
        synchronizeForward(taskCard.id);
        openSidebar(taskCard.id);
    });

    taskCard.querySelector('[data-index="title"]').addEventListener('input', () => {
        synchronizeForward(taskCard.id);
    });

    taskCard.querySelector('[data-index="description"]').addEventListener('input', () => {
        synchronizeForward(taskCard.id);
    });

    taskCard.querySelectorAll('.subtasks [contenteditable]').forEach(subtask => {
        subtask.addEventListener('input', () => {
            synchronizeForward(taskCard.id);
        });
    });

    taskCard.querySelector('span').addEventListener('click', () => {
        synchronizeForward(taskCard.id);
    });

    taskCard.querySelectorAll('.subtasks input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateProgress(taskCard.id, true);
            synchronizeForward(taskCard.id);
        });
    });
    taskCard.querySelectorAll('.add-subtask-button').forEach(button => {
        button.addEventListener('click', () => {
            addSubtask(button, true);
            synchronizeForward(taskCard.id);
        });
    });
}

function addSubtask(button, forward = true) {
    var taskCard = document.getElementById('task-details-content');
    if (forward) {
        taskCard = button.closest('.task-card');
    }
    const subtasksDiv = taskCard.querySelector('.subtasks');
    const newSubtaskIndex = subtasksDiv.children.length;
    const newSubtask = document.createElement('div');
    newSubtask.className = 'subtask';
    newSubtask.innerHTML = `
        <input type="checkbox" data-index="subtask-${newSubtaskIndex}">
        <label contenteditable="true" data-index="subtask-${newSubtaskIndex}">New Subtask</label>
        `;
    subtasksDiv.appendChild(newSubtask);
    updateProgress(taskCard.id, forward);
    if (forward) {
        newSubtask.querySelector('label').addEventListener('input', () => {
            synchronizeForward(taskCard.id);
        });

        newSubtask.querySelector('input[type="checkbox"]').addEventListener('change', () => {
            updateProgress(taskCard.id, true);
            synchronizeForward(taskCard.id);
        });

        synchronizeForward(taskCard.id);
    } else {
        newSubtask.querySelector('label').addEventListener('input', () => {
            current_edit_card.content = taskCard.innerHTML;
            synchronizeBackward(current_edit_card.id);
        });
        newSubtask.querySelector('input[type="checkbox"]').addEventListener('change', () => {
            const checkbox = newSubtask.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                checkbox.setAttribute('checked', 'checked');
            } else {
                checkbox.removeAttribute('checked');
            }
            updateProgress(current_edit_card.id, false);
            current_edit_card.content = taskCard.innerHTML;
            synchronizeBackward(current_edit_card.id);
        });
    }
}
