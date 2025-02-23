    document.addEventListener("DOMContentLoaded", () => { //initialize the elements
    const todoForm = document.getElementById("todo-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const completedList = document.getElementById("completed-list");
    const themeToggle = document.getElementById("theme-toggle");
    
   
    if (localStorage.getItem("theme") === "dark") { //remembers dark mode setting
        document.body.classList.add("dark-mode");
    }
    
    themeToggle.addEventListener("click", () => { //toggle dark mode button
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });
    
    setInterval(() => { //animates the little guy at the bottom of the screen
        gifContainer.style.animation = "none";
        void gifContainer.offsetWidth; 
        gifContainer.style.animation = "move-across 30s linear infinite";
    }, 300000);

    function loadTasks() { //displays the saved tasks from the JSON
         const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }
    
    loadTasks();
    
    todoForm.addEventListener("submit", (event) => { //allows you to create the inputted task
        event.preventDefault();
        addTask(taskInput.value);
        taskInput.value = "";
    });
    
    function addTask(text, completed = false) { //adds saved and new tasks
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${text.trim()}</span>
            <div>
                <button class="complete-btn">✔</button>
                <button class="delete-btn">✖</button>
            </div>
        `;
        
        if (completed) { //removes the check button from completed tasks and sorts them
            li.classList.add("completed");
            completedList.appendChild(li);
            li.querySelector(".complete-btn").remove();
        } else {
            taskList.appendChild(li);
        }
        
        saveTasks();
    }
    
    document.addEventListener("click", (event) => { //complete or delete a task
        if (event.target.classList.contains("complete-btn")) { //complete a task
            const taskItem = event.target.closest("li");
            taskItem.classList.add("completed");
            completedList.appendChild(taskItem);
            taskItem.querySelector(".complete-btn").remove();
            saveTasks();
        }
        
        if (event.target.classList.contains("delete-btn")) { //delete a task
            event.target.closest("li").remove();
            saveTasks();
        }
    });
    
    function saveTasks() { //save tasks to the JSON
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
