
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");

// Store tasks
let tasks = [];

// Add a new task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const task = {
        id: Date.now(),
        name: taskInput.value.trim(),
        date: taskDate.value,
        priority: taskPriority.value,
        completed: false
    };

    if (!task.name || !task.date) {
        alert("Please enter task details.");
        return;
    }

    tasks.push(task);

    displayTasks();

    taskForm.reset();

});

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const taskDiv = document.createElement("div");

        taskDiv.className = "task-item";

        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        taskDiv.innerHTML = `
            <div>
                <strong class="task-name">${escapeHTML(task.name)}</strong>
                <p>Deadline: ${escapeHTML(task.date)}</p>
                <p class="priority ${task.priority}">
                    ${task.priority} Priority
                </p>
            </div>

            <div class="task-actions">
                <button onclick="completeTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(taskDiv);

    });

}

// Prevent HTML injection in task names
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function(character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Mark task as completed
function completeTask(id) {

    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (task) {
        task.completed = !task.completed;
        displayTasks();
    }

}

// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    displayTasks();

}
