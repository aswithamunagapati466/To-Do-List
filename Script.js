// Select Elements

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");

// Array to Store Tasks

let tasks = [];

// Current Filter

let currentFilter = "all";

// Load Tasks from Local Storage

window.onload = function () {

    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    displayTasks();
};

// Add Task

addBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    displayTasks();

    taskInput.value = "";
});

// Save to Local Storage

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Display Tasks

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "task-item";

        const leftDiv = document.createElement("div");
        leftDiv.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {

            task.completed = checkbox.checked;

            saveTasks();

            displayTasks();

        });

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(span);

        const buttonDiv = document.createElement("div");
        buttonDiv.className = "task-buttons";

        // Edit Button

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function () {

            const updatedTask = prompt("Edit Task", task.text);

            if (updatedTask !== null && updatedTask.trim() !== "") {

                task.text = updatedTask.trim();

                saveTasks();

                displayTasks();

            }

        });

        // Delete Button

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function () {

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();

            displayTasks();

        });

        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);

        li.appendChild(leftDiv);
        li.appendChild(buttonDiv);

        taskList.appendChild(li);

    });

    updateTaskCount();

}

// Update Task Count

function updateTaskCount() {

    const remainingTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent = remainingTasks + " Tasks Left";

}

// Filter Buttons

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});