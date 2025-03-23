document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const slides = document.querySelectorAll(".slide");
    const timerDisplay = document.getElementById("timer");
    const soundAdvance = document.getElementById("soundAdvance");
    const soundRewind = document.getElementById("soundRewind");
    const container = document.getElementById("carouselContainer");

    let index = 0;
    let secondsElapsed = 0;
    let interval;

    function showSlide(idx) {
        carousel.style.transform = `translateX(-${idx * 100}%)`;
    }

    function resetTimer() {
        secondsElapsed = 0;
        clearInterval(interval);
        interval = setInterval(() => {
            secondsElapsed++;
            timerDisplay.textContent = `${secondsElapsed}s`;
            if (secondsElapsed >= 3) {
                nextSlide(true);
                resetTimer();
            }
        }, 1000);
    }

    function nextSlide(auto = false) {
        index = (index + 1) % slides.length;
        showSlide(index);
        if (!auto) soundAdvance.play();
    }

    function prevSlide() {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
        soundRewind.play();
    }

    container.addEventListener("click", (e) => {
        const clickX = e.clientX;
        const middle = window.innerWidth / 2;

        if (clickX < middle) {
            prevSlide();
        } else {
            nextSlide();
        }

        resetTimer();
    });

    showSlide(index);
    resetTimer();

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

    document.getElementById('prevBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        resetTimer();
    });

    document.getElementById('nextBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        resetTimer();
    });
});
