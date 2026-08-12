const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

const allTasksButton = document.getElementById("allTasksButton");
const pendingTasksButton = document.getElementById("pendingTasksButton");
const completedTasksButton = document.getElementById("completedTasksButton");

let tasks = [];

let currentFilter = "all";

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

function updateTaskCounter() {

    const totalTasks = tasks.length;

    let completedTasks = 0;

    for (let i = 0; i < tasks.length; i++) {

        if (tasks[i].completed) {
            completedTasks++;
        }

    }

    taskCounter.textContent = `${totalTasks} tarefas • ${completedTasks} concluídas`;
}

function updateActiveFilter() {

    allTasksButton.classList.remove("active");
    pendingTasksButton.classList.remove("active");
    completedTasksButton.classList.remove("active");

    if (currentFilter === "all") {
        allTasksButton.classList.add("active");
    }

    if (currentFilter === "pending") {
        pendingTasksButton.classList.add("active");
    }

    if (currentFilter === "completed") {
        completedTasksButton.classList.add("active");
    }
}

function createTask(task) {

    const taskItem = document.createElement("li");

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = task.completed;

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = task.text;

    if (task.completed) {
        taskTextElement.classList.add("completed");
    }

    const editButton = document.createElement("button");
    editButton.textContent = "✏️";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";

    taskCheckbox.addEventListener("change", function () {

        task.completed = taskCheckbox.checked;

        taskTextElement.classList.toggle("completed");

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks();

    });

    editButton.addEventListener("click", function () {

        const editInput = document.createElement("input");

        editInput.type = "text";
        editInput.value = task.text;

        taskItem.replaceChild(editInput, taskTextElement);

        editButton.textContent = "💾";

        editInput.focus();

        editButton.onclick = function () {

            const newText = editInput.value.trim();

            if (newText === "") {
                return;
            }

            task.text = newText;

            localStorage.setItem("tasks", JSON.stringify(tasks));

            renderTasks();

        };

    });

    deleteButton.addEventListener("click", function () {

        tasks = tasks.filter(function (currentTask) {
            return currentTask !== task;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks();

    });

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        if (currentFilter === "all") {

            createTask(task);

        }

        if (currentFilter === "pending" && task.completed === false) {

            createTask(task);

        }

        if (currentFilter === "completed" && task.completed === true) {

            createTask(task);

        }

    });

    updateTaskCounter();
}

renderTasks();

updateActiveFilter();

addTaskButton.addEventListener("click", function () {

    const taskText = taskInput.value;

    if (taskText === "") {
        return;
    }

    const newTask = {
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    taskInput.value = "";
});

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addTaskButton.click();

    }

});

allTasksButton.addEventListener("click", function () {

    currentFilter = "all";

    updateActiveFilter();

    renderTasks();

});

pendingTasksButton.addEventListener("click", function () {

    currentFilter = "pending";

    updateActiveFilter();

    renderTasks();

});

completedTasksButton.addEventListener("click", function () {

    currentFilter = "completed";

    updateActiveFilter();

    renderTasks();

});