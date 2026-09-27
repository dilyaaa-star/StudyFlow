let grades = JSON.parse(localStorage.getItem("grades")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const motivations = [
    "Ты не обязана сделать всё сразу. Один маленький шаг уже движение вперёд. 🌷",
    "Даже сложная тема становится понятной, если разбирать её постепенно.",
    "Ошибки — это часть обучения, а не доказательство того, что ты не умеешь.",
    "Сегодняшние 20 минут тоже имеют значение.",
    "Ты уже сделала больше, чем кажется. Продолжай в своём темпе. 💗",
    "Не сравнивай свой путь с чужим. Твоя задача — стать лучше себя вчерашней."
];

function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("ru-RU");

    document.getElementById("date").textContent =
        now.toLocaleDateString("ru-RU", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
}

setInterval(updateClock, 1000);
updateClock();

function saveData() {
    localStorage.setItem("grades", JSON.stringify(grades));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addGrade() {
    const subject = document.getElementById("subjectInput").value.trim();
    const grade = Number(document.getElementById("gradeInput").value);

    if (!subject || grade < 1 || grade > 5) {
        alert("Напиши предмет и оценку от 1 до 5.");
        return;
    }

    grades.push({
        subject: subject,
        grade: grade
    });

    document.getElementById("subjectInput").value = "";
    document.getElementById("gradeInput").value = "";

    saveData();
    renderGrades();
}

function deleteGrade(index) {
    grades.splice(index, 1);
    saveData();
    renderGrades();
}

function renderGrades() {
    const list = document.getElementById("gradesList");

    list.innerHTML = "";

    grades.forEach((item, index) => {
        const div = document.createElement("div");

        div.className = "grade-item";

        div.innerHTML = `
            <span>${item.subject}</span>
            <span>
                <strong class="grade">${item.grade}</strong>
                <button class="delete" onclick="deleteGrade(${index})">
                    Удалить
                </button>
            </span>
        `;

        list.appendChild(div);
    });

    document.getElementById("gradesCount").textContent = grades.length;

    if (grades.length > 0) {
        const sum = grades.reduce((total, item) => total + item.grade, 0);
        const average = sum / grades.length;

        document.getElementById("average").textContent =
            average.toFixed(2);
    } else {
        document.getElementById("average").textContent = "—";
    }
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) {
        alert("Напиши задание.");
        return;
    }

    tasks.push({
        text: text,
        done: false
    });

    input.value = "";

    saveData();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;

    saveData();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);

    saveData();
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("tasksList");

    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const div = document.createElement("div");

        div.className = "task-item";

        div.innerHTML = `
            <span
                class="${task.done ? "task-done" : ""}"
                onclick="toggleTask(${index})"
                style="cursor:pointer"
            >
                ${task.done ? "☑" : "☐"} ${task.text}
            </span>

            <button class="delete" onclick="deleteTask(${index})">
                Удалить
            </button>
        `;

        list.appendChild(div);
    });

    const unfinished = tasks.filter(task => !task.done).length;

    document.getElementById("tasksCount").textContent = unfinished;
}

function newMotivation() {
    const random =
        motivations[Math.floor(Math.random() * motivations.length)];

    document.getElementById("bigMotivation").textContent = random;
}

renderGrades();
renderTasks();