document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskName");
    const taskTimeInput = document.getElementById("taskTime");
    const taskColorInput = document.getElementById("taskColor");
    const calendar = document.getElementById("calendar");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Load tasks on page load
    function loadTasks() {
        tasks.forEach(task => addTaskToCalendar(task.text, task.time, task.color));
    }
    loadTasks();

    // Task submission
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (taskInput.value.trim() === "" || !taskTimeInput.value) return;
        
        addTaskToCalendar(taskInput.value.trim(), taskTimeInput.value, taskColorInput.value);
        saveTasks();
        
        taskInput.value = "";
        taskTimeInput.value = "";
    });

    // Add Task to Calendar
    function addTaskToCalendar(text, time, color) {
        let hour = parseInt(time.split(":")[0]);
        let targetSlot = document.querySelector(`.task-slot[data-hour='${hour}']`);

        if (targetSlot) {
            let taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.textContent = text;
            taskDiv.style.backgroundColor = color;
            targetSlot.appendChild(taskDiv);

            tasks.push({ text, time, color });
            saveTasks();
        }
    }

    // Save Tasks to Local Storage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Render Calendar
    function renderCalendar() {
        calendar.innerHTML = "";
        for (let hour = 6; hour <= 22; hour++) {
            let formattedHour = hour > 12 ? hour - 12 + " PM" : hour + " AM";
            if (hour === 12) formattedHour = "12 PM";
            let hourLabel = document.createElement("div");
            hourLabel.classList.add("hour");
            hourLabel.textContent = formattedHour;
            calendar.appendChild(hourLabel);

            let taskSlot = document.createElement("div");
            taskSlot.classList.add("task-slot");
            taskSlot.setAttribute("data-hour", hour);
            calendar.appendChild(taskSlot);
        }

        // Re-add stored tasks
        tasks.forEach(task => addTaskToCalendar(task.text, task.time, task.color));
    }

    renderCalendar();
});
