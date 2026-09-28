"use strict";

const totalTasks = 12;
const completedTasks = 5;

if (
    !Number.isInteger(totalTasks) ||
    !Number.isInteger(completedTasks) ||
    totalTasks < 0 ||
    totalTasks > 1000 ||
    completedTasks < 0 ||
    completedTasks > totalTasks
) {
    console.log("Ошибка: недопустимые данные.");
}
else {
    const remainingTasks = totalTasks - completedTasks;

    console.log("Осталось:", remainingTasks);

    if (totalTasks === 0) {
        console.log("Задач пока нет");
    }
    else {
        const percent = completedTasks / totalTasks * 100;

        console.log("Процент:", percent.toFixed(1) + "%");

        let status;

        if (completedTasks === 0) {
            status = "Не начато";
        }
        else if (completedTasks < totalTasks) {
            status = "В работе";
        }
        else {
            status = "Завершено";
        }

        console.log("Статус:", status);
    }
}