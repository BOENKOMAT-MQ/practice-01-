import assert from "node:assert/strict";
import { demoTasks } from "./src/data.js";
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
} from "./src/task-service.js";

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log("OK  " + name);
    passed++;
  } catch (error) {
    console.log("FAIL " + name);
    console.log("     " + error.message);
    failed++;
  }
}

check("createTask: обычный случай", () => {
  const r = createTask(20, "Новая задача", "high");
  assert.equal(r.ok, true);
  assert.equal(r.task.id, 20);
  assert.equal(r.task.title, "Новая задача");
  assert.equal(r.task.completed, false);
  assert.equal(r.task.priority, "high");
});

check("createTask: приоритет по умолчанию", () => {
  const r = createTask(21, "Без приоритета");
  assert.equal(r.ok, true);
  assert.equal(r.task.priority, "medium");
});

check("createTask: приоритет undefined", () => {
  const r = createTask(22, "undefined", undefined);
  assert.equal(r.ok, true);
  assert.equal(r.task.priority, "medium");
});

check("createTask: trim названия", () => {
  const r = createTask(23, "  Проверить  данные  ");
  assert.equal(r.ok, true);
  assert.equal(r.task.title, "Проверить  данные");
});

check("createTask: длина 1", () => {
  const r = createTask(24, "A");
  assert.equal(r.ok, true);
});

check("createTask: длина 100", () => {
  const r = createTask(25, "A".repeat(100));
  assert.equal(r.ok, true);
});

check("createTask: пустая строка", () => {
  const r = createTask(26, "");
  assert.equal(r.ok, false);
});

check("createTask: только пробелы", () => {
  const r = createTask(27, "   ");
  assert.equal(r.ok, false);
});

check("createTask: длина 101", () => {
  const r = createTask(28, "A".repeat(101));
  assert.equal(r.ok, false);
});

check("createTask: title число", () => {
  const r = createTask(29, 42);
  assert.equal(r.ok, false);
});

check("createTask: title null", () => {
  const r = createTask(30, null);
  assert.equal(r.ok, false);
});

check("createTask: title undefined", () => {
  const r = createTask(31, undefined);
  assert.equal(r.ok, false);
});

check("createTask: id 0", () => {
  assert.equal(createTask(0, "A").ok, false);
});

check("createTask: id -1", () => {
  assert.equal(createTask(-1, "A").ok, false);
});

check("createTask: id 1.5", () => {
  assert.equal(createTask(1.5, "A").ok, false);
});

check("createTask: id строка", () => {
  assert.equal(createTask("4", "A").ok, false);
});

check("createTask: id NaN", () => {
  assert.equal(createTask(NaN, "A").ok, false);
});

check("createTask: id Infinity", () => {
  assert.equal(createTask(Infinity, "A").ok, false);
});

check("createTask: id null", () => {
  assert.equal(createTask(null, "A").ok, false);
});

check("createTask: id undefined", () => {
  assert.equal(createTask(undefined, "A").ok, false);
});

check("createTask: id MAX_SAFE_INTEGER", () => {
  const r = createTask(Number.MAX_SAFE_INTEGER, "A");
  assert.equal(r.ok, true);
});

check("createTask: id MAX_SAFE_INTEGER + 1", () => {
  const r = createTask(Number.MAX_SAFE_INTEGER + 1, "A");
  assert.equal(r.ok, false);
});

check("createTask: приоритет urgent", () => {
  assert.equal(createTask(1, "A", "urgent").ok, false);
});

check("createTask: приоритет HIGH", () => {
  assert.equal(createTask(1, "A", "HIGH").ok, false);
});

check("createTask: приоритет high с пробелами", () => {
  assert.equal(createTask(1, "A", " high ").ok, false);
});

check("createTask: приоритет null", () => {
  assert.equal(createTask(1, "A", null).ok, false);
});

check("createTask: приоритет число", () => {
  assert.equal(createTask(1, "A", 1).ok, false);
});

check("createTask: два вызова — разные объекты", () => {
  const a = createTask(1, "A");
  const b = createTask(1, "A");
  assert.equal(a.ok, true);
  assert.equal(b.ok, true);
  assert.notEqual(a.task, b.task);
  assert.deepEqual(a.task, b.task);
});

check("findTaskById: id 4 в demoTasks", () => {
  const task = findTaskById(demoTasks, 4);
  assert.equal(task.id, 4);
  assert.equal(task.title, "Подготовить модель задач");
});

check("findTaskById: id 777", () => {
  assert.equal(findTaskById(demoTasks, 777), undefined);
});

check("findTaskById: строка 4", () => {
  assert.equal(findTaskById(demoTasks, "4"), undefined);
});

check("findTaskById: пустой массив", () => {
  assert.equal(findTaskById([], 4), undefined);
});

check("getPendingTasks: demoTasks", () => {
  const pending = getPendingTasks(demoTasks);
  assert.deepEqual(pending.map((t) => t.id), [4, 7]);
});

check("getPendingTasks: пустой массив", () => {
  assert.deepEqual(getPendingTasks([]), []);
});

check("getPendingTasks: всё выполнено", () => {
  const all = demoTasks.map((t) => ({ ...t, completed: true }));
  assert.deepEqual(getPendingTasks(all), []);
});

check("getPendingTasks: ничего не выполнено", () => {
  const none = demoTasks.map((t) => ({ ...t, completed: false }));
  assert.equal(getPendingTasks(none).length, 4);
});

check("getTaskTitles: demoTasks", () => {
  assert.deepEqual(getTaskTitles(demoTasks), [
    "Изучить функции",
    "Подготовить модель задач",
    "Проверить методы массивов",
    "Оформить README",
  ]);
});

check("getTaskTitles: пустой массив", () => {
  assert.deepEqual(getTaskTitles([]), []);
});

check("getTaskStats: demoTasks", () => {
  assert.deepEqual(getTaskStats(demoTasks), {
    total: 4, completed: 2, pending: 2, progress: 50,
  });
});

check("getTaskStats: пустой массив", () => {
  assert.deepEqual(getTaskStats([]), {
    total: 0, completed: 0, pending: 0, progress: 0,
  });
});

check("getTaskStats: ничего не выполнено", () => {
  const none = demoTasks.map((t) => ({ ...t, completed: false }));
  assert.equal(getTaskStats(none).progress, 0);
});

check("getTaskStats: всё выполнено", () => {
  const all = demoTasks.map((t) => ({ ...t, completed: true }));
  assert.equal(getTaskStats(all).progress, 100);
});

check("getTaskStats: 1 из 3", () => {
  const three = [
    { id: 1, title: "A", completed: true, priority: "low" },
    { id: 2, title: "B", completed: false, priority: "low" },
    { id: 3, title: "C", completed: false, priority: "low" },
  ];
  const s = getTaskStats(three);
  assert.equal(s.total, 3);
  assert.equal(s.completed, 1);
  assert.equal(s.pending, 2);
  assert.ok(Math.abs(s.progress - 100 / 3) < 1e-9);
});

check("addTask: добавить id 20", () => {
  const r = addTask(demoTasks, 20, "Новая задача", "high");
  assert.equal(r.ok, true);
  assert.equal(r.tasks.length, 5);
  assert.equal(r.tasks[4].id, 20);
  assert.equal(demoTasks.length, 4);
});

check("addTask: добавить в пустой массив", () => {
  const r = addTask([], 1, "A");
  assert.equal(r.ok, true);
  assert.equal(r.tasks.length, 1);
});

check("addTask: повтор id 4", () => {
  const r = addTask(demoTasks, 4, "Дубль");
  assert.equal(r.ok, false);
  assert.equal(demoTasks.length, 4);
});

check("addTask: некорректное поле", () => {
  const r = addTask(demoTasks, 20, "");
  assert.equal(r.ok, false);
});

check("addTask: некорректный id", () => {
  const r = addTask(demoTasks, "20", "A");
  assert.equal(r.ok, false);
});

check("setTaskCompleted: id 4 -> true", () => {
  const r = setTaskCompleted(demoTasks, 4, true);
  assert.equal(r.ok, true);
  assert.equal(r.tasks.find((t) => t.id === 4).completed, true);
  assert.equal(demoTasks.find((t) => t.id === 4).completed, false);
});

check("setTaskCompleted: только completed", () => {
  const r = setTaskCompleted(demoTasks, 4, true);
  const task = r.tasks.find((t) => t.id === 4);
  assert.equal(task.title, "Подготовить модель задач");
  assert.equal(task.priority, "high");
});

check("setTaskCompleted: строка true", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, "true").ok, false);
});

check("setTaskCompleted: число 1", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, 1).ok, false);
});

check("setTaskCompleted: null", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, null).ok, false);
});

check("setTaskCompleted: undefined", () => {
  assert.equal(setTaskCompleted(demoTasks, 4, undefined).ok, false);


});

check("setTaskCompleted: задача не найдена", () => {
  assert.equal(setTaskCompleted(demoTasks, 777, true).ok, false);
});

check("setTaskCompleted: новый объект задачи", () => {
  const r = setTaskCompleted(demoTasks, 4, true);
  const oldTask = demoTasks.find((t) => t.id === 4);
  const newTask = r.tasks.find((t) => t.id === 4);
  assert.notEqual(oldTask, newTask);
});

check("renameTask: id 10 с пробелами", () => {
  const r = renameTask(demoTasks, 10, "  Новое название  ");
  assert.equal(r.ok, true);
  const task = r.tasks.find((t) => t.id === 10);
  assert.equal(task.title, "Новое название");
  assert.equal(task.id, 10);
  assert.equal(task.completed, true);
  assert.equal(task.priority, "medium");
});

check("renameTask: некорректное название", () => {
  assert.equal(renameTask(demoTasks, 10, "").ok, false);
});

check("renameTask: название не строка", () => {
  assert.equal(renameTask(demoTasks, 10, 42).ok, false);
});

check("renameTask: задача не найдена", () => {
  assert.equal(renameTask(demoTasks, 777, "A").ok, false);
});

check("renameTask: исходный массив не изменён", () => {
  renameTask(demoTasks, 10, "Другое");
  assert.equal(demoTasks.find((t) => t.id === 10).title, "Оформить README");
});

check("renameTask: повтор текущего названия", () => {
  const r = renameTask(demoTasks, 10, "Оформить README");
  assert.equal(r.ok, true);
});

check("removeTask: id 7", () => {
  const r = removeTask(demoTasks, 7);
  assert.equal(r.ok, true);
  assert.deepEqual(r.tasks.map((t) => t.id), [1, 4, 10]);
  assert.equal(demoTasks.length, 4);
});

check("removeTask: единственная задача", () => {
  const one = [{ id: 1, title: "A", completed: false, priority: "low" }];
  const r = removeTask(one, 1);
  assert.equal(r.ok, true);
  assert.deepEqual(r.tasks, []);
});

check("removeTask: задача не найдена", () => {
  assert.equal(removeTask(demoTasks, 777).ok, false);
});

check("removeTask: пустой массив", () => {
  assert.equal(removeTask([], 1).ok, false);
});

console.log("");
console.log("Пройдено: " + passed + ", провалено: " + failed);

if (failed > 0) {
  process.exit(1);
}(demoTasks)