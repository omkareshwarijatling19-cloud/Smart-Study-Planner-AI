from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_connection, create_table

app = Flask(__name__)
CORS(app)
# Create database table
create_table()

# Test backend connection
@app.route("/")
def home():
    return "Smart Study Planner AI Backend is Running!"

# CREATE - Add a task
@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()

    conn = get_connection()
    conn.execute(
        """INSERT INTO tasks (title, subject, due_date, priority)
           VALUES (?, ?, ?, ?)""",
        (
            data["title"],
            data.get("subject"),
            data.get("due_date"),
            data.get("priority", "Medium")
        )
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Task added successfully!"}), 201

# READ - Get all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()

    return jsonify([dict(task) for task in tasks])

# UPDATE - Modify a task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()

    conn = get_connection()
    cursor = conn.execute(
        """UPDATE tasks
           SET title=?, subject=?, due_date=?, priority=?, status=?
           WHERE id=?""",
        (
            data["title"],
            data.get("subject"),
            data.get("due_date"),
            data.get("priority", "Medium"),
            data.get("status", "Pending"),
            task_id
        )
    )

    conn.commit()
    updated = cursor.rowcount
    conn.close()

    if updated == 0:
        return jsonify({"message": "Task not found"}), 404

    return jsonify({"message": "Task updated successfully!"})


# DELETE - Remove a task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_connection()

    cursor = conn.execute(
        "DELETE FROM tasks WHERE id=?",
        (task_id,)
    )

    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({"message": "Task not found"}), 404

    return jsonify({"message": "Task deleted successfully!"})


if __name__ == "__main__":
    app.run(debug=True)
