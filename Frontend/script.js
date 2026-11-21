
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

// ================================
// DAY 6 - STUDY SCHEDULE FEATURE
// ================================

const scheduleForm = document.getElementById("scheduleForm");
const subjectInput = document.getElementById("subjectInput");
const topicInput = document.getElementById("topicInput");
const studyDate = document.getElementById("studyDate");
const studyDuration = document.getElementById("studyDuration");
const scheduleList = document.getElementById("scheduleList");
const totalStudyTime = document.getElementById("totalStudyTime");

// Load saved study sessions
let studySessions = JSON.parse(
    localStorage.getItem("studySessions") || "[]"
);

// Save study sessions
function saveStudySessions() {
    localStorage.setItem(
        "studySessions",
        JSON.stringify(studySessions)
    );
}

// Add a study session
scheduleForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const session = {
        id: Date.now(),
        subject: subjectInput.value.trim(),
        topic: topicInput.value.trim(),
        date: studyDate.value,
        duration: Number(studyDuration.value)
    };

    if (
        !session.subject ||
        !session.topic ||
        !session.date ||
        !Number.isFinite(session.duration) ||
        session.duration <= 0
    ) {
        alert("Please enter valid study session details.");
        return;
    }

    studySessions.push(session);

    saveStudySessions();
    displayStudySessions();

    scheduleForm.reset();
});

// Display study sessions
function displayStudySessions() {

    scheduleList.innerHTML = "";

    if (studySessions.length === 0) {
        scheduleList.innerHTML =
            '<p class="empty-message">No study sessions planned yet.</p>';
    }

    studySessions.forEach(function(session) {

        const sessionDiv = document.createElement("div");

        sessionDiv.className = "task-item";

        sessionDiv.innerHTML = `
            <div>
                <strong class="task-name">
                    ${escapeHTML(session.subject)}
                </strong>

                <p class="task-details">
                    Topic: ${escapeHTML(session.topic)}
                </p>

                <p class="task-details">
                    Date: ${escapeHTML(session.date)}
                </p>

                <p class="task-details">
                    Duration: ${session.duration} minutes
                </p>
            </div>

            <div class="task-actions">
                <button
                    class="delete-btn"
                    data-session-id="${session.id}">
                    Delete
                </button>
            </div>
        `;

        scheduleList.appendChild(sessionDiv);

    });

    updateStudyTime();
}

// Delete a study session
scheduleList.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-session-id]");

    if (!button) return;

    const id = Number(button.dataset.sessionId);

    studySessions = studySessions.filter(function(session) {
        return session.id !== id;
    });

    saveStudySessions();
    displayStudySessions();
});

// Calculate total planned study time
function updateStudyTime() {

    const totalMinutes = studySessions.reduce(
        function(total, session) {
            return total + session.duration;
        },
        0
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let result = "";

    if (hours > 0) {
        result += hours + " hr ";
    }

    result += minutes + " min";

    totalStudyTime.textContent = result;
}

// Load saved sessions
displayStudySessions();
