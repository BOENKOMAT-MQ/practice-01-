export function createTask(id, title, priority = "medium") {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      ok: false,
      error: "id должен быть положительным безопасным целым числом",
    };
  }
  if (typeof title !== "string") {
    return {
      ok: false,
      error: "title должен быть строкой",
    };
  }
  const cleanTitle = title.trim();
  if (cleanTitle.length < 1 || cleanTitle.length > 100) {
    return {
      ok: false,
      error: "title должен содержать от 1 до 100 символов",
    };
  }
  if (!["low", "medium", "high"].includes(priority)) {
    return {
      ok: false,
      error: "priority должен быть low, medium или high",
    };
  }
  return {
    ok: true,
    task: {
      id,
      title: cleanTitle,
      completed: false,
      priority,
    },
  };
}

export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => !task.completed);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  const result = createTask(id, title, priority);
  if (!result.ok) {
    return result;
  }
  if (tasks.some((task) => task.id === id)) {
    return {
      ok: false,
      error: "Задача с таким id уже существует",
    };
  }
  return {
    ok: true,
    tasks: [...tasks, result.task],
  };
}

export function setTaskCompleted(tasks, id, completed) {
  if (typeof completed !== "boolean") {
    return {
      ok: false,
      error: "completed должен быть true или false",
    };
  }
  const task = findTaskById(tasks, id);
  if (!task) {
    return {
      ok: false,
      error: "Задача не найдена",
    };
  }
  return {
    ok: true,
    tasks: tasks.map((item) =>
      item.id === id ? { ...item, completed } : item
    ),
  };
}

export function renameTask(tasks, id, title) {
  const task = findTaskById(tasks, id);
  if (!task) {
    return {
      ok: false,
      error: "Задача не найдена",
    };
  }
  if (
    typeof title !== "string" ||
    title.trim().length < 1 ||
    title.trim().length > 100
  ) {
    return {
      ok: false,
      error: "title должен содержать от 1 до 100 символов",
    };
  }
  return {
    ok: true,
    tasks: tasks.map((item) =>
      item.id === id ? { ...item, title: title.trim() } : item
    ),
  };
}

export function removeTask(tasks, id) {
  const task = findTaskById(tasks, id);
  if (!task) {
    return {
      ok: false,
      error: "Задача не найдена",
    };
  }
  return {
    ok: true,
    tasks: tasks.filter((item) => item.id !== id),
  };
}