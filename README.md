# Smart Study Planner AI 📚

## About the Project
Smart Study Planner AI is a web-based application designed to help students organize their academic tasks, manage study activities, and track their learning progress.

The main goal is to make study planning easier and help students manage their time effectively.

## Problem Statement
Students often face difficulties managing their study schedules, completing assignments, and tracking their academic progress.

This project aims to provide a simple platform to organize study tasks and monitor progress.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Visual Studio Code
- Git
- GitHub

## Implemented Features
- Dashboard with sidebar navigation
- Welcome section
- Summary cards
- Add study tasks
- Delete study tasks
- Mark tasks as completed
- Task progress tracking

## Project Structure
```text
Smart-Study-Planner-AI/
│
├── frontend/
├── backend/
├── docs/
├── tests/
├── README.md
└── .gitignore
```

## Upcoming Features
- Study Schedule Planner
- Subject-wise study planning
- Study reminders and notifications
- AI-based personalized study recommendations
- Backend integration

## Current Project Status
The initial version of the application has been developed with dashboard, task management, and progress tracking functionality.

Additional features will be implemented in the upcoming development stages.

## Future Goals
- Improve the user interface.
- Develop additional study management modules.
- Explore AI integration.
- Test and improve application functionality.

## GitHub Repository
[Smart Study Planner AI](https://github.com/omkareshwarijatling19-cloud/Smart-Study-Planner-AI)

---
Developed by **Jatling Omkareshwari**  
UNAI TECH Virtual Internship Program 2026
## Day 8 – Study Schedule Management Feature

### Feature Overview
The Study Schedule Management feature allows students to organize their daily learning sessions by entering subject names, topics, dates, and study durations.

### Features Implemented
1. Add study sessions.
2. Enter subject and topic details.
3. Select study dates.
4. Set study duration in minutes.
5. Delete unwanted study sessions.
6. Automatically calculate total planned study time.
7. Store study sessions using browser Local Storage.
8. Display previously saved sessions after refreshing the page.

### Technologies Used
- HTML5
- CSS3
- JavaScript
- Browser Local Storage

### Testing
- Tested adding study sessions.
- Tested deleting study sessions.
- Verified total study time calculation.
- Checked Local Storage functionality.
- Tested date validation.

### Outcome
Successfully implemented and integrated the Study Schedule Management feature into the Smart Study Planner AI application.

## Day 9 – Database Design and Integration

### Database Used
SQLite

### Backend Technology
Python and Flask

### Database Table: Tasks

| Field | Data Type |
|---|---|
| id | INTEGER PRIMARY KEY |
| title | TEXT |
| subject | TEXT |
| due_date | TEXT |
| priority | TEXT |
| status | TEXT |

### CRUD Operations

1. CREATE – Add new study tasks.
2. READ – Retrieve saved tasks.
3. UPDATE – Modify existing task details.
4. DELETE – Remove tasks from the database.

### Database Connectivity
The Flask backend connects to SQLite using Python's sqlite3 module.

### API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /tasks | Add task |
| GET | /tasks | Retrieve tasks |
| PUT | /tasks/{id} | Update task |
| DELETE | /tasks/{id} | Delete task |

### Challenges Faced
- Configuring the Flask backend.
- Connecting Python with SQLite.
- Testing database operations.
- Resolving server connection errors.

### Result
Successfully implemented SQLite database connectivity
and tested all four CRUD operations.

## Day 11 – Frontend and Backend Integration

### Project: Smart Study Planner AI

**Objective:** Integrate the frontend, Flask backend, and SQLite database.

### Technologies Used
- HTML
- CSS
- JavaScript
- Python Flask
- SQLite
- REST API

### Integration Features
1. Connected frontend with Flask backend using Fetch API.
2. Implemented POST API to add tasks.
3. Implemented GET API to retrieve tasks.
4. Implemented PUT API to update task status.
5. Implemented DELETE API to remove tasks.
6. Displayed database tasks on the frontend dashboard.
7. Added API error handling and loading messages.

### Complete Workflow
User enters task details → Frontend sends API request → Flask processes the request → SQLite stores the task → Frontend displays the saved task.

### Testing Results
- Task creation: Successful
- Task retrieval: Successful
- Task completion and undo: Successful
- Task deletion: Successful

### Challenges Faced
Initially, the frontend could not communicate with the backend due to API URL configuration and connection issues. These were resolved by configuring the API URL and enabling Flask-CORS.

### Conclusion
Successfully integrated the frontend, backend, and SQLite database to create a connected Smart Study Planner application.