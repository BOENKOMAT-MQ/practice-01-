import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";
import { demoTasks } from "./data.js";

let currentTasks = demoTasks;

function showStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(label);
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
  console.log("");
}

console.log("=== Исходные данные ===");
console.log("Задачи:", currentTasks);
console.log("Названия:", getTaskTitles(currentTasks));
console.log("Невыполненные:", getPendingTasks(currentTasks).map((t) => t.id));
showStats("Сводка до изменений:", currentTasks);

console.log("=== Добавление id = 20 ===");
let result = addTask(currentTasks, 20, "Добавить проверку", "high");
if (result.ok) {
  currentTasks = result.tasks;
  console.log("Добавлено. Идентификаторы:", currentTasks.map((t) => t.id));
} else {
  console.error("Ошибка:", result.error);
}
showStats("Сводка после добавления:", currentTasks);

console.log("=== Установка completed = true для id = 4 ===");
result = setTaskCompleted(currentTasks, 4, true);
if (result.ok) {
  currentTasks = result.tasks;
  console.log("Задача id = 4 завершена.");
} else {
  console.error("Ошибка:", result.error);
}
showStats("Сводка после завершения:", currentTasks);

console.log("=== Переименование id = 10 ===");
result = renameTask(currentTasks, 10, "Подготовить инструкцию запуска");
if (result.ok) {
  currentTasks = result.tasks;
  console.log("Переименовано.");
} else {
  console.error("Ошибка:", result.error);
}
showStats("Сводка после переименования:", currentTasks);

console.log("=== Удаление id = 7 ===");
result = removeTask(currentTasks, 7);
if (result.ok) {
  currentTasks = result.tasks;
  console.log("Удалено. Идентификаторы:", currentTasks.map((t) => t.id));
} else {
  console.error("Ошибка:", result.error);
}
showStats("Сводка после удаления:", currentTasks);

console.log("=== Демонстрация отказа: повторный id = 20 ===");
result = addTask(currentTasks, 20, "Дубликат", "low");
if (result.ok) {
  console.log("Неожиданно добавлено.");
} else {
  console.log("Ожидаемый отказ:", result.error);
  console.log("Идентификаторы не изменились:", currentTasks.map((t) => t.id));
}

console.log("");
console.log("=== Итоговое состояние ===");
console.log("Идентификаторы:", currentTasks.map((t) => t.id));
console.log("Единственная незавершённая:", getPendingTasks(currentTasks).map((t) => t.id));
showStats("Итоговая сводка:", currentTasks);

console.log("=== Проверка сохранности demoTasks ===");
console.log("Исходный массив:", demoTasks.map((t) => ({ id: t.id, completed: t.completed })));