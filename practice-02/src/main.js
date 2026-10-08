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

console.log("Создание задачи:");
console.log(createTask(20, " Подготовить демонстрацию ", "high"));

console.log("\nПоиск задачи:");
console.log(findTaskById(demoTasks, 4));

console.log("\nНезавершённые задачи:");
console.log(getPendingTasks(demoTasks));

console.log("\nНазвания задач:");
console.log(getTaskTitles(demoTasks));

console.log("\nСтатистика:");
console.log(getTaskStats(demoTasks));

console.log("\nДобавление:");
console.log(addTask(demoTasks, 20, "Новая задача"));

console.log("\nЗавершение:");
console.log(setTaskCompleted(demoTasks, 4, true));

console.log("\nПереименование:");
console.log(renameTask(demoTasks, 4, " Новое название "));

console.log("\nУдаление:");
console.log(removeTask(demoTasks, 4));