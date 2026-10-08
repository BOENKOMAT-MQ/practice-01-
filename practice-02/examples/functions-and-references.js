// 1. Функция и разные типы аргументов
function sum(a, b) {
  return a + b;
}

console.log("1a:", sum(2, 3));
console.log("1b:", sum("2", 3));
console.log("1c type:", typeof sum("2", 3));

// 2. Стрелочная функция с пропущенным return
const square = (value) => {
  value * value;
};

console.log("2:", square(4));

// 3. Две переменные ссылаются на один объект
const original = {
  title: "Черновик",
  completed: false,
};

const alias = original;
alias.completed = true;

console.log("3a:", original.completed);
console.log("3b:", original === alias);

// 4. Spread массива копирует массив, но не объекты внутри
const tasks = [
  { id: 1, title: "Первая" },
  { id: 2, title: "Вторая" },
];

const copiedTasks = [...tasks];
copiedTasks[0].title = "Изменена";

console.log("4a:", copiedTasks === tasks);
console.log("4b:", copiedTasks[0] === tasks[0]);
console.log("4c:", tasks[0].title);

// 5. Spread объекта и порядок свойств
const task = {
  id: 1,
  title: "Старая задача",
  completed: false,
};

const updatedTask = {
  ...task,
  title: "Новая задача",
};

console.log("5a:", task.title);
console.log("5b:", updatedTask.title);
console.log("5c:", task === updatedTask);

// 6. Параметр по умолчанию
function showValue(value = "default") {
  return value;
}

console.log("6a:", showValue());
console.log("6b:", showValue(undefined));
console.log("6c:", showValue(null));
console.log("6d:", showValue(""));