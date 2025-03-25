document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const slides = document.querySelectorAll(".slide");
    const timerDisplay = document.getElementById("timer");
    const soundAdvance = document.getElementById("Advance");
    const soundRewind = document.getElementById("Rewind");
    const container = document.getElementById("carouselContainer");
    const taskCategoryInput = document.getElementById("taskCategory");

    let currentView = "daily"; 
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
        calendar.innerHTML = "";

        if (currentView === "daily") {
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

            tasks.forEach(task =>
                addTaskToCalendar(task.text, task.time, task.color, task.category || "other")
            );
        }

        if (currentView === "weekly") {
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            days.forEach(day => {
                const dayColumn = document.createElement("div");
                dayColumn.classList.add("week-day-column");

                const dayHeader = document.createElement("h3");
                dayHeader.textContent = day;
                dayColumn.appendChild(dayHeader);

                for (let hour = 6; hour <= 22; hour++) {
                    const timeBlock = document.createElement("div");
                    timeBlock.classList.add("task-slot", "weekly");
                    timeBlock.setAttribute("data-day", day);
                    timeBlock.setAttribute("data-hour", hour);
                    timeBlock.innerHTML = `${hour}:00`;
                    dayColumn.appendChild(timeBlock);
                }

                calendar.appendChild(dayColumn);
            });
        }
    }

    renderCalendar();

    document.getElementById("dailyViewBtn").addEventListener("click", () => {
        currentView = "daily";
        renderCalendar();
    });

    document.getElementById("weeklyViewBtn").addEventListener("click", () => {
        currentView = "weekly";
        renderCalendar();
    });

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
});
