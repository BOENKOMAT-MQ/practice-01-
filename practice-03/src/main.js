import { demoTasks, variantTasks, variantNumber } from "./data.js";
import { findTaskById, setTaskCompleted, removeTask } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderTaskList, renderSummary, renderEmptyState } from "./task-view.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
};

const isVariant = new URLSearchParams(window.location.search).get("dataset") === "variant";
const initialTasks = isVariant ? variantTasks : demoTasks;
let currentTasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";

elements.datasetLabel.textContent = isVariant
  ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
  : "Общий контрольный набор";

function setMessage(text) {
  elements.message.textContent = text;
}

function renderApp() {
  const visibleTasks = getVisibleTasks(currentTasks, currentFilter);

  renderTaskList(elements.list, visibleTasks);
  renderSummary(elements.summary, currentTasks, visibleTasks.length);
  renderEmptyState(elements.empty, currentTasks.length, visibleTasks.length);

  const filterButtons = elements.filters.querySelectorAll("button[data-filter]");
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function restoreTaskFocus(id, action) {
  const card = elements.list.querySelector(`li[data-task-id="${id}"]`);
  if (card) {
    const button = card.querySelector(`button[data-action="${action}"]`);
    if (button) {
      button.focus();
      return;
    }
  }
  const activeFilter = elements.filters.querySelector("button.is-active");
  if (activeFilter) {
    activeFilter.focus();
  }
}

function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-action]");
  if (!button || !elements.list.contains(button)) return;

  const action = button.dataset.action;
  if (action !== "toggle" && action !== "delete") return;

  const card = button.closest("li[data-task-id]");
  if (!card) return;

  const id = Number(card.dataset.taskId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    setMessage("Некорректный идентификатор задачи");
    return;
  }

  if (action === "toggle") {
    const task = findTaskById(currentTasks, id);
    if (!task) {
      setMessage("Задача не найдена");
      return;
    }
    const result = setTaskCompleted(currentTasks, id, !task.completed);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    currentTasks = result.tasks;
    setMessage("");
    renderApp();
    restoreTaskFocus(id, action);
    return;
  }

  const result = removeTask(currentTasks, id);
  if (!result.ok) {
    setMessage(result.error);
    return;
  }
  currentTasks = result.tasks;
  setMessage("");
  renderApp();
  restoreTaskFocus(id, action);
}

function handleFilterClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-filter]");
  if (!button || !elements.filters.contains(button)) return;

  const filter = button.dataset.filter;
  if (filter !== "all" && filter !== "pending" && filter !== "completed") return;

  currentFilter = filter;
  setMessage("");
  renderApp();
}

elements.list.addEventListener("click", handleTaskListClick);
elements.filters.addEventListener("click", handleFilterClick);

renderApp();