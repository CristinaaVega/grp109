document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const slides = document.querySelectorAll(".slide");
    const timerDisplay = document.getElementById("timer");
    const soundAdvance = document.getElementById("Advance");
    const soundRewind = document.getElementById("Rewind");
    const container = document.getElementById("carouselContainer");
    const taskCategoryInput = document.getElementById("taskCategory");
    const dailyCalendar = document.getElementById("dailyCalendar");
    const weeklyCalendar = document.getElementById("weeklyCalendar");

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
        if (e.target.id === "prevBtn" || e.target.id === "nextBtn") {
            return;
        }

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

    function loadTasks() {
        tasks.forEach(task =>
            addTaskToCalendar(task.text, task.time, task.color, task.category || "other")
        );
    }

    loadTasks();

    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (taskInput.value.trim() === "" || !taskTimeInput.value) return;

        const category = taskCategoryInput.value;
        let taskColor = taskColorInput.value;

        if (category === "work") {
            taskColor = "#007bff";
        } else if (category === "school") {
            taskColor = "#28a745";
        }

        addTaskToCalendar(taskInput.value.trim(), taskTimeInput.value, taskColor, category);
        saveTasks();

        taskInput.value = "";
        taskTimeInput.value = "";
        taskColorInput.value = "#ff0000";
    });

    function addTaskToCalendar(text, time, color, category = "other") {
        let hour = parseInt(time.split(":")[0]);
        let targetSlot = document.querySelector(`.task-slot[data-hour='${hour}']`);

        if (targetSlot) {
            let taskDiv = document.createElement("div");
            taskDiv.classList.add("task", category);
            taskDiv.textContent = text;
            taskDiv.style.backgroundColor = color;
            targetSlot.appendChild(taskDiv);

            tasks.push({ text, time, color, category });
            saveTasks();
        }
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderCalendar() {
        dailyCalendar.innerHTML = "";

        for (let hour = 6; hour <= 22; hour++) {
            let formattedHour = hour > 12 ? hour - 12 + " PM" : hour + " AM";
            if (hour === 12) formattedHour = "12 PM";

            let hourLabel = document.createElement("div");
            hourLabel.classList.add("hour");
            hourLabel.textContent = formattedHour;
            dailyCalendar.appendChild(hourLabel);

            let taskSlot = document.createElement("div");
            taskSlot.classList.add("task-slot");
            taskSlot.setAttribute("data-hour", hour);
            dailyCalendar.appendChild(taskSlot);
        }

        tasks.forEach(task =>
            addTaskToCalendar(task.text, task.time, task.color, task.category || "other")
        );
    }

    renderCalendar();

    document.getElementById('prevBtn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        secondsElapsed = 0;
        prevSlide();
        resetTimer();
    });

    document.getElementById('nextBtn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        secondsElapsed = 0;
        nextSlide();
        resetTimer();
    });

    const dailyContainer = document.getElementById("dailyCalendarContainer");
    const weeklyContainer = document.getElementById("weeklyCalendarContainer");

    document.getElementById('weeklyViewBtn').addEventListener('click', () => {
        dailyContainer.style.display = "none";
        weeklyContainer.style.display = "block";
        renderWeeklyCalendar();
    });
    document.getElementById('dailyViewBtn').addEventListener('click', () => {
        dailyContainer.style.display = "block";
        weeklyContainer.style.display = "none";
        renderCalendar();
    });

    function renderWeeklyCalendar() {
        weeklyCalendar.innerHTML = "";
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        days.forEach(day => {
            const dayColumn = document.createElement("div");
            dayColumn.classList.add("day-column");

            const dayLabel = document.createElement("div");
            dayLabel.classList.add("day-label");
            dayLabel.textContent = day;
            dayColumn.appendChild(dayLabel);

            for (let hour = 6; hour <= 22; hour++) {
                let taskSlot = document.createElement("div");
                taskSlot.classList.add("task-slot");
                taskSlot.setAttribute("data-hour", hour);
                taskSlot.setAttribute("data-day", day);
                dayColumn.appendChild(taskSlot);
            }

            weeklyCalendar.appendChild(dayColumn);
        });
    }
});
