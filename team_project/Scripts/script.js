    document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const completedList = document.getElementById("completed-list");
    const themeToggle = document.getElementById("theme-toggle");
    
   
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });
    
    setInterval(() => {
        gifContainer.style.animation = "none";
        void gifContainer.offsetWidth; 
        gifContainer.style.animation = "move-across 30s linear infinite";
    }, 300000);

    function loadTasks() {
         const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }
    
    loadTasks();
    
    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addTask(taskInput.value);
        taskInput.value = "";
    });
    
    function addTask(text, completed = false) {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${text.trim()}</span>
            <div>
                <button class="complete-btn">✔</button>
                <button class="delete-btn">✖</button>
            </div>
        `;
        
        if (completed) {
            li.classList.add("completed");
            completedList.appendChild(li);
            li.querySelector(".complete-btn").remove();
        } else {
            taskList.appendChild(li);
        }
        
        saveTasks();
    }
    
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("complete-btn")) {
            const taskItem = event.target.closest("li");
            taskItem.classList.add("completed");
            completedList.appendChild(taskItem);
            taskItem.querySelector(".complete-btn").remove();
            saveTasks();
        }
        
        if (event.target.classList.contains("delete-btn")) {
            event.target.closest("li").remove();
            saveTasks();
        }
    });
    
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach(li => {
            tasks.push({ text: li.querySelector("span").textContent.trim(), completed: false });
        });
        document.querySelectorAll("#completed-list li").forEach(li => {
            tasks.push({ text: li.querySelector("span").textContent.trim(), completed: true });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
