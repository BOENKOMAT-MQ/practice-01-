export function addTask(tasks, id, title, priority = "medium") {
  const result = createTask(id, title, priority);

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    tasks: [...tasks, result.task],
  };
}

export function setTaskCompleted(tasks, id, completed) {
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

  if (typeof title !== "string" || title.trim().length < 1 || title.trim().length > 100) {
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