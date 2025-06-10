function addTask() {
	let taskInput = document.getElementById("taskInput");
	let taskText = taskInput.value.trim();
	if (taskText === "") return;
	let taskList = document.getElementById("taskList");
	let li = document.createElement("li");
	li.innerHTML = `<input type='checkbox' class='task-checkbox' onchange='toggleTask(this)'><span class='task-text'>${taskText}</span> <button class='edit-btn' onclick='editTask(this)'><i class="fa-solid fa-pen-to-square"></i></button> <button class='delete-btn' onclick='deleteTask(this)'>X</button>`;
	taskList.appendChild(li);
	taskInput.value = "";
	saveTasks();
	updateCounter();
}

function toggleTask(checkbox) {
	if (checkbox.checked) {
		checkbox.nextSibling.style.textDecoration = "line-through";
	} else {
		checkbox.nextSibling.style.textDecoration = "none";
	}
	saveTasks();
	updateCounter();
}

function editTask(btn) {
	let li = btn.parentElement;
	let taskText = li.querySelector(".task-text").textContent.trim();
	let newTaskText = prompt("Edit task:", taskText);
	if (newTaskText !== null && newTaskText.trim() !== "") {
		li.querySelector(".task-text").textContent = newTaskText;
		saveTasks();
	}
}

function deleteTask(btn) {
	btn.parentElement.remove();
	saveTasks();
	updateCounter();
}

function saveTasks() {
	let tasks = [];
	document.querySelectorAll("#taskList li").forEach((li) => {
		let taskText = li.querySelector(".task-text").textContent.trim();
		let isChecked = li.querySelector(".task-checkbox").checked;
		tasks.push({ text: taskText, checked: isChecked });
	});
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
	let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
	tasks.forEach((task) => {
		let taskList = document.getElementById("taskList");
		let li = document.createElement("li");
		li.innerHTML = `<input type='checkbox' class='task-checkbox' ${
			task.checked ? "checked" : ""
		} onchange='toggleTask(this)'><span class='task-text'>${
			task.text
		}</span> <button class='edit-btn' onclick='editTask(this)'><i class="fa-solid fa-pen-to-square"></i></button> <button class='delete-btn' onclick='deleteTask(this)'>X</button>`;
		if (task.checked) {
			li.querySelector(".task-text").style.textDecoration = "line-through";
		}
		taskList.appendChild(li);
	});
	updateCounter();
}

function updateCounter() {
	let tasks = document.querySelectorAll("#taskList li");
	let completedTasks = document.querySelectorAll(
		"#taskList li .task-checkbox:checked"
	).length;
	document.getElementById(
		"taskCounter"
	).textContent = `${completedTasks}/${tasks.length} completed`;
}

function changeTheme() {
	let theme = document.getElementById("themeSelector").value;
	document.body.className = theme;
	localStorage.setItem("theme", theme);
}

function loadTheme() {
	let theme = localStorage.getItem("theme") || "default";
	document.body.className = theme;
	document.getElementById("themeSelector").value = theme;
}

function generateShareCard() {
	const shareCardContainer = document.getElementById("shareCardContainer");
	const shareCard = document.getElementById("shareCard");

	let customTitle = prompt(
		"Enter a title for your share card (optional):",
		"My To-Do List"
	);

	if (customTitle === null || customTitle.trim() === "") {
		customTitle = "My To-Do List";
	}

	const currentTheme = document.body.className || "default";

	shareCard.innerHTML = "";

	const header = document.createElement("div");
	header.className = "share-card-header";
	const today = new Date();

	const day = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const year = today.getFullYear();
	const formattedDate = `${day}/${month}/${year}`;

	header.innerHTML = `<h2>${customTitle}</h2><p>${formattedDate}</p>`;
	shareCard.appendChild(header);

	const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

	const taskList = document.createElement("div");
	taskList.className = "share-card-tasks";

	if (tasks.length === 0) {
		const emptyMsg = document.createElement("div");
		emptyMsg.style.textAlign = "center";
		emptyMsg.style.padding = "20px 0";
		emptyMsg.style.color = "#999";
		emptyMsg.textContent = "No tasks yet!";
		taskList.appendChild(emptyMsg);
	} else {
		const screenWidth = window.innerWidth;

		const maxVisibleTasks = screenWidth < 360 ? 10 : 20;

		const visibleTasks =
			tasks.length > maxVisibleTasks ? tasks.slice(0, maxVisibleTasks) : tasks;

		visibleTasks.forEach((task) => {
			const taskItem = document.createElement("div");
			taskItem.className = task.checked
				? "share-card-item completed"
				: "share-card-item";

			const checkbox = document.createElement("div");
			checkbox.className = "share-card-checkbox";
			checkbox.innerHTML = task.checked ? "✓" : "";

			const taskText = document.createElement("div");
			taskText.className = "share-card-text";
			taskText.textContent = task.text;

			taskItem.appendChild(checkbox);
			taskItem.appendChild(taskText);
			taskList.appendChild(taskItem);
		});

		if (tasks.length > maxVisibleTasks) {
			const moreMsg = document.createElement("div");
			moreMsg.style.textAlign = "center";
			moreMsg.style.fontSize = "12px";
			moreMsg.style.color = "#888";
			moreMsg.style.padding = "5px 0";
			moreMsg.textContent = `+ ${tasks.length - maxVisibleTasks} more tasks`;
			taskList.appendChild(moreMsg);
		}
	}

	shareCard.appendChild(taskList);

	const footer = document.createElement("div");
	footer.className = "share-card-footer";

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((task) => task.checked).length;
	const percentage =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const progressContainer = document.createElement("div");
	progressContainer.className = "progress-container";

	const progressBar = document.createElement("div");
	progressBar.className = "progress-bar";
	const progressFill = document.createElement("div");
	progressFill.className = "progress-fill";
	progressFill.style.width = `${percentage}%`;

	progressBar.appendChild(progressFill);
	progressContainer.appendChild(progressBar);

	footer.innerHTML = `<div>Progress: ${completedTasks}/${totalTasks} (${percentage}% completed)</div>`;
	footer.appendChild(progressContainer);

	shareCard.appendChild(footer);

	shareCard.className = "share-card";
	shareCard.classList.add(`theme-${currentTheme}`);

	shareCardContainer.style.display = "flex";
}

function closeShareCard() {
	document.getElementById("shareCardContainer").style.display = "none";
}

function copyShareCard() {
	const shareCard = document.getElementById("shareCard");

	html2canvas(shareCard, {
		scale: 2,
		allowTaint: true,
		useCORS: true,
	}).then((canvas) => {
		canvas.toBlob((blob) => {
			try {
				const item = new ClipboardItem({ "image/png": blob });

				navigator.clipboard
					.write([item])
					.then(() => {
						alert("To-do list card copied to clipboard!");
					})
					.catch((err) => {
						console.error("Error copying to clipboard:", err);
						alert("Failed to copy to clipboard. Try downloading instead.");
					});
			} catch (err) {
				console.error("Copy error:", err);
				alert("Failed to copy to clipboard. Try downloading instead.");
			}
		});
	});
}

function downloadShareCard() {
	const shareCard = document.getElementById("shareCard");

	html2canvas(shareCard).then((canvas) => {
		const link = document.createElement("a");
		link.download = `todo-list-${new Date().toISOString().slice(0, 10)}.png`;
		link.href = canvas.toDataURL("image/png");
		link.click();
	});
}

document.addEventListener("DOMContentLoaded", () => {
	loadTasks();
	loadTheme();
});
