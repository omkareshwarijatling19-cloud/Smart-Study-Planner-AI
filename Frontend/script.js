
const API_URL = "http://127.0.0.1:5000";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");

let tasks = [];

// Fetch tasks from Flask backend
async function loadTasks() {
    taskList.innerHTML = "<p>Loading tasks...</p>";

    try {
        const response = await fetch(`${API_URL}/tasks`);

        if (!response.ok) {
            throw new Error("Unable to load tasks");
        }

        const data = await response.json();

        tasks = data.map(function(task) {
            return {
                id: task.id,
                name: task.title,
                date: task.due_date || "",
                priority: task.priority || "Medium",
                completed: task.status === "Completed"
            };
        });

        displayTasks();

    } catch (error) {
        taskList.innerHTML =
            '<p class="empty-message">Unable to load tasks. Please check your backend.</p>';
        console.error(error);
    }
}

// Add task using POST API
taskForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const task = {
        title: taskInput.value.trim(),
        subject: "",
        due_date: taskDate.value,
        priority: taskPriority.value
    };

    if (!task.title || !task.due_date) {
        alert("Please enter all task details.");
        return;
    }

    const submitButton = taskForm.querySelector('[type="submit"]');

    try {
        if (submitButton) submitButton.disabled = true;

        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to add task");
        }

        alert("Task added successfully!");

        taskForm.reset();

        await loadTasks();

    } catch (error) {
        alert("Error: " + error.message);
        console.error(error);

    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

// Prevent HTML injection
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(character) {
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

                <p class="priority ${escapeHTML(task.priority)}">
                    ${escapeHTML(task.priority)} Priority
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

// Update or delete tasks using API
taskList.addEventListener("click", async function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) return;

    button.disabled = true;

    try {

        let response;

        if (action === "complete") {

            response = await fetch(`${API_URL}/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: task.name,
                    subject: "",
                    due_date: task.date,
                    priority: task.priority,
                    status: task.completed ? "Pending" : "Completed"
                })
            });

        } else if (action === "delete") {

            response = await fetch(`${API_URL}/tasks/${id}`, {
                method: "DELETE"
            });

        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Request failed");
        }

        await loadTasks();

    } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
        button.disabled = false;
    }
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

// Load tasks when website opens
loadTasks();


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
