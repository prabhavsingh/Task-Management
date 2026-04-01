const BASE_URL_TASK = "/api/v1/tasks";

// Load tasks on page load
window.onload = fetchTasks;

// Fetch all tasks
async function fetchTasks() {
  const res = await fetch(BASE_URL_TASK);
  const data = await res.json();

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  data.data.task.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";

    if (task.status === "completed") {
      div.classList.add("completed");
    }

    div.innerHTML = `
      <div id="view-${task._id}">
        <h3>${task.title}</h3>
        <p>${task.description || ""}</p>
        <p>Priority: ${task.priority}</p>

        <div class="actions">
          <button onclick="markComplete('${task._id}')">Complete</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
          <button onclick="enableEdit('${task._id}', '${task.title}', '${task.description || ""}', '${task.priority}')">Edit</button>
        </div>
      </div>

      <div id="edit-${task._id}" style="display:none;">
        <input id="title-${task._id}" value="${task.title}" />
        <input id="desc-${task._id}" value="${task.description || ""}" />

        <select id="priority-${task._id}">
          <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
          <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
          <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
        </select>

        <div class="actions">
          <button onclick="saveEdit('${task._id}')">Save</button>
          <button onclick="cancelEdit('${task._id}')">Cancel</button>
        </div>
      </div>
    `;

    taskList.appendChild(div);
  });
}

function goToAnalytics() {
  window.location.href = "analytics.html";
}

async function createTask() {
  const username = document.getElementById("username").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;

  await fetch("/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, title, description, priority }),
  });

  fetchTasks();
}

// Mark complete
async function markComplete(id) {
  await fetch(`${BASE_URL_TASK}/${id}/complete`, {
    method: "PATCH",
  });

  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${BASE_URL_TASK}/${id}`, {
    method: "DELETE",
  });

  fetchTasks();
}

function enableEdit(id) {
  document.getElementById(`view-${id}`).style.display = "none";
  document.getElementById(`edit-${id}`).style.display = "block";
}

function cancelEdit(id) {
  document.getElementById(`view-${id}`).style.display = "block";
  document.getElementById(`edit-${id}`).style.display = "none";
}

async function saveEdit(id) {
  const title = document.getElementById(`title-${id}`).value;
  const description = document.getElementById(`desc-${id}`).value;
  const priority = document.getElementById(`priority-${id}`).value;

  await fetch(`/api/v1/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description, priority }),
  });

  fetchTasks();
}
