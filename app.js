// ===============================
// STUDYFLOW — APP.JS
// ===============================

let homework = JSON.parse(localStorage.getItem("homework")) || [];
let grades = JSON.parse(localStorage.getItem("grades")) || [];
let diary = JSON.parse(localStorage.getItem("diary")) || [];

// ---------- ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ----------

function openPage(pageName) {
    let transition = document.getElementById("pageTransition");

    if (!transition) {
        transition = document.createElement("div");
        transition.id = "pageTransition";
        document.body.appendChild(transition);
    }

    transition.classList.add("show");

    setTimeout(() => {

        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
        });

        const page =
            document.getElementById("page-" + pageName);

        if (page) {
            page.classList.add("active");
        }

        document.querySelectorAll(".nav-button").forEach(button => {
            button.classList.remove("active");

            if (button.dataset.page === pageName) {
                button.classList.add("active");
            }
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        setTimeout(() => {
            transition.classList.remove("show");
        }, 120);

    }, 150);
}
// ---------- ВРЕМЯ ----------

function updateClock() {
    const now = new Date();

    const clock = document.getElementById("clock");
    const date = document.getElementById("todayDate");

    if (clock) {
        clock.textContent =
            now.getHours().toString().padStart(2, "0") +
            ":" +
            now.getMinutes().toString().padStart(2, "0");
    }

    if (date) {
        date.textContent = now.toLocaleDateString("ru-RU", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
    }
}

// ---------- МОТИВАЦИЯ ----------

const motivations = [
    "Ты справишься. Главное — делать понемногу каждый день.",
    "Даже один решённый пример — это уже прогресс.",
    "Не нужно быть идеальной. Нужно продолжать.",
    "Сегодняшние маленькие шаги создают большой результат.",
    "Ты уже начала — значит, половина дела сделана.",
    "Ошибки — это часть обучения.",
    "Ты можешь больше, чем тебе кажется.",
    "Ещё немного — и ты увидишь результат."
];

function updateMotivation() {
    const greetings = [
        "Доброе утро, котёнок 🐾",
        "Привет, солнышко ☀️",
        "С возвращением, зайчик 🌷",
        "Рада тебя видеть, котёнок 🤍",
        "Привет, маленькое солнышко ✨",
        "Снова здесь, зайчик 🐰",
        "Добро пожаловать, котёнок 🌸"
    ];

    const motivations = [
        "Сегодня можно не спешить. Просто сделай один маленький шаг 🌷",
        "Ты не обязана сделать всё сразу. Достаточно начать с одного дела ☁️",
        "Пусть сегодня всё получится немного легче, чем вчера 🤍",
        "Даже маленький прогресс — всё равно прогресс ✨",
        "Ты уже многое делаешь. Продолжай в своём темпе 🌸",
        "Сегодняшний день может стать твоим маленьким шагом вперёд ☀️",
        "Не торопись. Учись спокойно и береги себя 🫧"
    ];

    // День года — благодаря этому фразы меняются именно каждый день
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const dayOfYear = Math.floor(diff / 86400000);

    const greeting =
        greetings[dayOfYear % greetings.length];

    const motivation =
        motivations[dayOfYear % motivations.length];

    const homeName =
        document.getElementById("homeName");

    const motivationText =
        document.getElementById("motivationText");

    const motivationBig =
        document.getElementById("motivationBig");

    if (homeName) {
        homeName.textContent = greeting;
    }

    if (motivationText) {
        motivationText.textContent = motivation;
    }

    if (motivationBig) {
        motivationBig.textContent = motivation;
    }
}

// ---------- ИМЯ ----------

function saveName() {
    const input = document.getElementById("nameInput");

    if (!input) return;

    const name = input.value.trim();

    if (name) {
        localStorage.setItem("studyflow_name", name);
        updateName();
        showToast("Имя сохранено ✓");
    }
}

function updateName() {
    const name = localStorage.getItem("studyflow_name") || "Диляра";

    const homeName = document.getElementById("homeName");

    if (homeName) {
        homeName.textContent = name;
    }

    const input = document.getElementById("nameInput");

    if (input) {
        input.value = name;
    }
}

// ---------- ДОМАШКА ----------

function addHomework() {
    const subject = document.getElementById("homeworkSubject")?.value.trim();
    const title = document.getElementById("homeworkTitle")?.value.trim();
    const date = document.getElementById("homeworkDate")?.value;

    if (!subject || !title) {
        showToast("Заполни предмет и задание");
        return;
    }

    homework.push({
        id: Date.now(),
        subject,
        title,
        date,
        completed: false
    });

    saveHomework();
    renderHomework();

    document.getElementById("homeworkSubject").value = "";
    document.getElementById("homeworkTitle").value = "";
    document.getElementById("homeworkDate").value = "";

    showToast("Задание добавлено ✓");
}

function saveHomework() {
    localStorage.setItem("homework", JSON.stringify(homework));
}

function toggleHomework(id) {
    const task = homework.find(item => item.id === id);

    if (task) {
        task.completed = !task.completed;
        saveHomework();
        renderHomework();
    }
}

function deleteHomework(id) {
    homework = homework.filter(item => item.id !== id);

    saveHomework();
    renderHomework();

    showToast("Задание удалено");
}

function renderHomework() {
    const list = document.getElementById("homeworkList");

    if (!list) return;

    list.innerHTML = "";

    if (homework.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                Пока нет домашних заданий
            </div>
        `;
    }

    homework.forEach(task => {
        const item = document.createElement("div");

        item.className =
            "task " + (task.completed ? "completed" : "");

        item.innerHTML = `
            <div class="task-info">
                <b>${escapeHTML(task.title)}</b>
                <small>${escapeHTML(task.subject)}</small>
                ${task.date ? `<small>${task.date}</small>` : ""}
            </div>

            <div class="task-actions">
                <button onclick="toggleHomework(${task.id})">
                    ${task.completed ? "↩" : "✓"}
                </button>

                <button onclick="deleteHomework(${task.id})">
                    🗑
                </button>
            </div>
        `;

        list.appendChild(item);
    });

    const total = homework.length;
    const completed = homework.filter(item => item.completed).length;

    const count = document.getElementById("homeworkCount");
    const totalElement = document.getElementById("homeworkTotal");

    if (count) count.textContent = completed;
    if (totalElement) totalElement.textContent = total;
}

// ---------- ОЦЕНКИ ----------

function addGrade() {
    const subject = document.getElementById("gradeSubject")?.value.trim();
    const value = Number(document.getElementById("gradeValue")?.value);
    const date = document.getElementById("gradeDate")?.value;

    if (!subject) {
        showToast("Напиши предмет");
        return;
    }

    if (!value || value < 1 || value > 5) {
        showToast("Оценка должна быть от 1 до 5");
        return;
    }

    grades.push({
        id: Date.now(),
        subject,
        value,
        date
    });

    localStorage.setItem("grades", JSON.stringify(grades));

    renderGrades();

    document.getElementById("gradeSubject").value = "";
    document.getElementById("gradeValue").value = "";
    document.getElementById("gradeDate").value = "";

    showToast("Оценка добавлена ✓");
}

function deleteGrade(id) {
    grades = grades.filter(item => item.id !== id);

    localStorage.setItem("grades", JSON.stringify(grades));

    renderGrades();

    showToast("Оценка удалена");
}

function renderGrades() {
    const list = document.getElementById("gradesList");

    if (!list) return;

    list.innerHTML = "";

    if (grades.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                Пока нет оценок
            </div>
        `;
    }

    grades.forEach(grade => {
        const item = document.createElement("div");

        item.className = "grade-item";

        item.innerHTML = `
            <div class="grade-info">
                <b>${escapeHTML(grade.subject)}</b>
                ${grade.date ? `<small>${grade.date}</small>` : ""}
            </div>

            <div class="grade-number">
                ${grade.value}
            </div>

            <button onclick="deleteGrade(${grade.id})">
                🗑
            </button>
        `;

        list.appendChild(item);
    });

    updateAverage();
}

function updateAverage() {
    const average =
        grades.length === 0
            ? 0
            : grades.reduce((sum, grade) => sum + grade.value, 0) /
              grades.length;

    const rounded = average.toFixed(2);

    const big = document.getElementById("averageBig");
    const home = document.getElementById("homeAverage");

    if (big) big.textContent = rounded;
    if (home) home.textContent = rounded;
}

// ---------- ДНЕВНИК ----------

function addDiary() {
    const title = document.getElementById("diaryTitle")?.value.trim();
    const text = document.getElementById("diaryText")?.value.trim();

    if (!text) {
        showToast("Напиши что-нибудь");
        return;
    }

    diary.unshift({
        id: Date.now(),
        title: title || "Моя запись",
        text,
        date: new Date().toLocaleDateString("ru-RU")
    });

    localStorage.setItem("diary", JSON.stringify(diary));

    renderDiary();

    document.getElementById("diaryTitle").value = "";
    document.getElementById("diaryText").value = "";

    showToast("Запись сохранена ✓");
}

function deleteDiary(id) {
    diary = diary.filter(item => item.id !== id);

    localStorage.setItem("diary", JSON.stringify(diary));

    renderDiary();

    showToast("Запись удалена");
}

function renderDiary() {
    const list = document.getElementById("diaryList");

    if (!list) return;

    list.innerHTML = "";

    if (diary.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                Пока нет записей
            </div>
        `;
        return;
    }

    diary.forEach(entry => {
        const item = document.createElement("div");

        item.className = "diary-item";

        item.innerHTML = `
            <div class="diary-header">
                <h3>${escapeHTML(entry.title)}</h3>

                <button onclick="deleteDiary(${entry.id})">
                    🗑
                </button>
            </div>

            <p>${escapeHTML(entry.text)}</p>

            <small>${entry.date}</small>
        `;

        list.appendChild(item);
    });
}

// ---------- БЫСТРАЯ ЗАМЕТКА ----------

function saveQuickNote() {
    const note = document.getElementById("quickNote");

    if (!note) return;

    localStorage.setItem(
        "studyflow_note",
        note.value
    );

    const status = document.getElementById("quickNoteStatus");

    if (status) {
        status.textContent = "Заметка сохранена ✓";
    }

    showToast("Заметка сохранена");
}

function loadQuickNote() {
    const note = document.getElementById("quickNote");

    if (note) {
        note.value =
            localStorage.getItem("studyflow_note") || "";
    }
}

// ---------- АВАТАР ----------

function changeAvatar(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const image = e.target.result;

        localStorage.setItem(
            "studyflow_avatar",
            image
        );

        updateAvatar();
    };

    reader.readAsDataURL(file);
}

function updateAvatar() {
    const image =
        localStorage.getItem("studyflow_avatar");

    const avatars = [
        document.getElementById("avatarTop"),
        document.getElementById("avatarSettings")
    ];

    avatars.forEach(avatar => {
        if (!avatar) return;

        if (image) {
            avatar.style.backgroundImage =
                `url("${image}")`;

            avatar.style.backgroundSize = "cover";
            avatar.style.backgroundPosition = "center";

            avatar.textContent = "";
        }
    });
}

// ---------- ПОГОДА ----------

async function loadWeather() {

    const weatherTemp =
        document.getElementById("weatherTemp");

    const weatherText =
        document.getElementById("weatherText");

    const weatherIcon =
        document.getElementById("weatherIcon");

    if (!weatherTemp || !weatherText || !weatherIcon) {
        return;
    }

    weatherText.textContent = "Загрузка...";
    weatherIcon.textContent = "🌤️";

    // По умолчанию — Уфа
    let latitude = 54.7388;
    let longitude = 55.9721;

    // Пытаемся определить местоположение
    try {

        if (navigator.geolocation) {

            const position = await new Promise((resolve, reject) => {

                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: false,
                        timeout: 5000,
                        maximumAge: 600000
                    }
                );

            });

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        }

    } catch (error) {
        console.log("Геолокация недоступна, используется Уфа");
    }

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,weather_code` +
            `&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Ошибка погоды");
        }

        const data = await response.json();

        const temperature =
            Math.round(data.current.temperature_2m);

        const code =
            data.current.weather_code;

        weatherTemp.textContent =
            temperature + "°C";

        let text = "Ясно";
        let icon = "☀️";

        if (code === 0) {
            text = "Ясно";
            icon = "☀️";
        }

        else if (code >= 1 && code <= 3) {
            text = "Облачно";
            icon = "☁️";
        }

        else if (code >= 45 && code <= 48) {
            text = "Туман";
            icon = "🌫️";
        }

        else if (code >= 51 && code <= 67) {
            text = "Дождь";
            icon = "🌧️";
        }

        else if (code >= 71 && code <= 77) {
            text = "Снег";
            icon = "❄️";
        }

        else if (code >= 80 && code <= 82) {
            text = "Ливень";
            icon = "🌧️";
        }

        else if (code >= 95) {
            text = "Гроза";
            icon = "⛈️";
        }

        weatherText.textContent = text;
        weatherIcon.textContent = icon;

    } catch (error) {

        console.log(error);

        weatherTemp.textContent = "—";
        weatherText.textContent = "Не удалось загрузить";
        weatherIcon.textContent = "🌥️";
    }
}

// ---------- УВЕДОМЛЕНИЯ ----------

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// ---------- ОЧИСТКА ----------

function clearAllData() {
    const answer = confirm(
        "Удалить все оценки, домашние задания, записи и заметки?"
    );

    if (!answer) return;

    localStorage.removeItem("homework");
    localStorage.removeItem("grades");
    localStorage.removeItem("diary");
    localStorage.removeItem("studyflow_note");
    localStorage.removeItem("studyflow_name");
    localStorage.removeItem("studyflow_avatar");

    homework = [];
    grades = [];
    diary = [];

    renderHomework();
    renderGrades();
    renderDiary();
    loadQuickNote();
    updateName();

    showToast("Данные очищены");
}

// ---------- БЕЗОПАСНЫЙ ТЕКСТ ----------

function escapeHTML(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ---------- ЗАПУСК ----------

document.addEventListener("DOMContentLoaded", () => {

    updateClock();
    setInterval(updateClock, 1000);

    updateMotivation();
    updateName();

    renderHomework();
    renderGrades();
    renderDiary();

    loadQuickNote();
    updateAvatar();

    loadWeather();

});