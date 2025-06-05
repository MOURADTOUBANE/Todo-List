let $input = document.querySelector(".input");
let $submit = document.querySelector(".add");
let $tasks = document.querySelector(".tasks");
let $filters = document.querySelectorAll(".filter");

let arrayOfTasks = [];

if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

getDataFromLocalStorage();
renderTasks("all");

$submit.onclick = function () {
  if ($input.value.trim() !== "") {
    addTaskToArray($input.value.trim());
    $input.value = "";
  }
};

$tasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    const id = e.target.parentElement.getAttribute("data-id");
    deleteTask(id);
  }

  if (e.target.classList.contains("task")) {
    const id = e.target.getAttribute("data-id");
    toggleStatusTask(id);
  }
});

$filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    $filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.getAttribute("data-filter"));
  });
});

function addTaskToArray(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };

  arrayOfTasks.push(task);
  updateLocalStorage();
  renderTasks(getCurrentFilter());
}

function renderTasks(filter) {
  $tasks.innerHTML = "";

  let filtered = arrayOfTasks;


  if (filter === "progress") {
    filtered = arrayOfTasks.filter((task) => !task.completed);
  } else if (filter === "completed") {
    filtered = arrayOfTasks.filter((task) => task.completed);
  }

 
  filtered.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    div.setAttribute("data-id", task.id);
    div.textContent = task.title;

  
    if (task.completed) {
      div.classList.add("done");
      div.style.backgroundColor = "#ffdddd"; // light red
    } else {
      div.style.backgroundColor = "#fff6cc"; // light yellow
    }

    let span = document.createElement("span");
    span.className = "del";
    span.textContent = "Delete";

    div.appendChild(span);
    $tasks.appendChild(div);
  });
}


function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage() {
  let data = localStorage.getItem("tasks");
  if (data) {
    arrayOfTasks = JSON.parse(data);
  }
}

function deleteTask(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  updateLocalStorage();
  renderTasks(getCurrentFilter());
}

function toggleStatusTask(taskId) {
  arrayOfTasks = arrayOfTasks.map((task) =>
    task.id == taskId ? { ...task, completed: !task.completed } : task
  );
  updateLocalStorage();
  renderTasks(getCurrentFilter());
}

function getCurrentFilter() {
  const active = document.querySelector(".filter.active");
  return active ? active.getAttribute("data-filter") : "all";
}
