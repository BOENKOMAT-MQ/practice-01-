import { getTaskStats } from "./task-service.js";

const PRIORITY_LABELS = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("task-card");
  li.dataset.taskId = String(task.id);
  if (task.completed) {
    li.classList.add("is-completed");
  }

  const title = document.createElement("h3");
  title.classList.add("task-title");
  title.textContent = task.title;

  const status = document.createElement("span");
  status.classList.add("task-status");
  status.textContent = task.completed ? "Выполнена" : "В работе";

  const priority = document.createElement("span");
  priority.classList.add("task-priority");
  priority.textContent = PRIORITY_LABELS[task.priority] ?? task.priority;

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.dataset.action = "toggle";
  toggleButton.setAttribute("aria-pressed", String(task.completed));
  const toggleLabel = document.createElement("span");
  toggleLabel.classList.add("action-label");
  toggleLabel.textContent = "Выполнена";
  toggleButton.append(toggleLabel);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  const deleteLabel = document.createElement("span");
  deleteLabel.classList.add("action-label");
  deleteLabel.textContent = "Удалить";
  deleteButton.append(deleteLabel);

  actions.append(toggleButton, deleteButton);

  li.append(title, status, priority, actions);
  return li;
}

export function renderTaskList(listElement, tasks) {
  const cards = tasks.map((task) => createTaskElement(task));
  listElement.replaceChildren(...cards);
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  const stats = getTaskStats(tasks);

  const totalEl = summaryElement.querySelector('[data-stat="total"]');
  const completedEl = summaryElement.querySelector('[data-stat="completed"]');
  const pendingEl = summaryElement.querySelector('[data-stat="pending"]');
  const progressEl = summaryElement.querySelector('[data-stat="progress"]');
  const visibleEl = summaryElement.querySelector('[data-stat="visible"]');

  if (totalEl) totalEl.textContent = String(stats.total);
  if (completedEl) completedEl.textContent = String(stats.completed);
  if (pendingEl) pendingEl.textContent = String(stats.pending);
  if (progressEl) progressEl.textContent = stats.progress.toFixed(1) + "%";
  if (visibleEl) visibleEl.textContent = String(visibleCount);
}

export function renderEmptyState(messageElement, total, visibleCount) {
  if (total === 0 && visibleCount === 0) {
    messageElement.textContent = "Список задач пуст.";
    messageElement.hidden = false;
    return;
  }
  if (total > 0 && visibleCount === 0) {
    messageElement.textContent = "Нет задач по выбранному фильтру.";
    messageElement.hidden = false;
    return;
  }
  messageElement.textContent = "";
  messageElement.hidden = true;
}