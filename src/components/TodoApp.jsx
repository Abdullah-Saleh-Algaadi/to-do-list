import { useState, useEffect } from "react";

function TodoApp() {
  const [newTask, setNewTask] = useState("");
  const [taskList, setTaskList] = useState([]);

  // Get tasks from server when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  function fetchTasks() {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => setTaskList(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function handleAddTask() {
    if (newTask.trim() === "") return;

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_name: newTask }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchTasks(); // reload tasks after adding
        setNewTask("");
      })
      .catch((err) => console.error("Error adding task:", err));
  }

  function handleDeleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchTasks(); // reload tasks after deleting
      })
      .catch((err) => console.error("Error deleting task:", err));
  }

  return (
    <>
      <div className="todo-app">
        <div className="input-wrapper">
          <input
            type="text"
            className="task-input"
            value={newTask}
            onChange={handleInputChange}
          />
          <button className="add-task-but" onClick={handleAddTask}>
            Add Task
          </button>
        </div>

        <div className="task-container">
          <ul>
            {taskList.map((task) => (
              <li key={task.id}>
                {task.task_name}{" "}
                <button
                  className="delete-task-but"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default TodoApp;
