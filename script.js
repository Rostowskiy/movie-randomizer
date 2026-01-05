let currentItems = [];
let currentCategory = null;

const moviesBtn = document.getElementById("moviesBtn");
const seriesBtn = document.getElementById("seriesBtn");
const rollBtn = document.getElementById("rollBtn");

const statusBlock = document.querySelector(".status");
const statusText = document.getElementById("statusText");

const resultBlock = document.querySelector(".result-card");
const resultText = document.getElementById("resultText");

function setStatus(message) {
  statusText.textContent = message;
}

function setResult(text) {
  resultText.textContent = text;
}

function clearActiveCategory() {
  moviesBtn.classList.remove("active");
  seriesBtn.classList.remove("active");
}

function setActiveCategory(categoryName) {
  clearActiveCategory();

  if (categoryName === "movies") {
    moviesBtn.classList.add("active");
  } else if (categoryName === "series") {
    seriesBtn.classList.add("active");
  }
}

async function loadList(url, categoryName) {
  setStatus("Загружаю список..");
  statusBlock.classList.remove("hidden");

  currentItems = [];
  currentCategory = null;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Ошибка загрузки: " + response.status);
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Неверный формат JSON");
    }

    currentItems = data;
    currentCategory = categoryName;

    setActiveCategory(categoryName);

    setStatus(`${currentItems.length} позиций`);
  } catch (error) {
    console.error(error);
    setStatus(
      "Не удалось загрузить список. Проверь JSON и запуск через сервер"
    );
  }
}

moviesBtn.addEventListener("click", () => {
  loadList("movies.json", "movies");
});

seriesBtn.addEventListener("click", () => {
  loadList("series.json", "series");
});

rollBtn.addEventListener("click", () => {
  if (currentCategory === null) {
    setStatus("Сначала выбери категорию");
    statusBlock.classList.remove("hidden");
    return;
  }

  if (currentItems.length === 0) {
    setStatus("Список не загружен");
    statusBlock.classList.remove("hidden");
    return;
  }

  const randomIndex = Math.floor(Math.random() * currentItems.length);
  const item = currentItems[randomIndex];

  const title = item.title;
  const year = item.year ? ` (${item.year})` : "";

  setResult(title + year);
  resultBlock.classList.remove("hidden");

  setStatus("Если не хочется — жми Ролл ещё раз");
  statusBlock.classList.remove("hidden");
});
