
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

// Display today's date
const todayDate = document.getElementById("todayDate");

todayDate.textContent = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
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
        alert("Please enter all task details.");
        return;
    }

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskForm.reset();
});

// Prevent HTML injection
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

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty-message">No study tasks yet. Add your first task!</p>';
    }

    tasks.forEach(function(task) {

        const taskDiv = document.createElement("div");

        taskDiv.className = "task-item";

        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        taskDiv.innerHTML = `
            <div>
                <strong class="task-name">
                    ${escapeHTML(task.name)}
                </strong>

                <p class="task-details">
                    Deadline: ${escapeHTML(task.date)}
                </p>

                <p class="priority ${task.priority}">
                    ${task.priority} Priority
                </p>
            </div>

            <div class="task-actions">
                <button data-action="complete" data-id="${task.id}">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="delete-btn"
                    data-action="delete"
                    data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(taskDiv);

    });

    updateDashboard();
}

// Handle task buttons
taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "complete") {

        const task = tasks.find(function(item) {
            return item.id === id;
        });

        if (task) {
            task.completed = !task.completed;
        }

    } else if (action === "delete") {

        tasks = tasks.filter(function(item) {
            return item.id !== id;
        });

    }

    saveTasks();
    displayTasks();
});

// Update dashboard statistics
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("progressPercent").textContent =
        percentage + "%";

    document.getElementById("progressBar").style.width =
        percentage + "%";
}

// Load saved tasks
displayTasks();
