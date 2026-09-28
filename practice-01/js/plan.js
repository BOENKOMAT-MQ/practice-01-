"use strict";

const totalTasks = 12;
const completedTasks = 5;
const dailyLimit = 3;

if (
    !Number.isInteger(totalTasks) ||
    totalTasks < 0 ||
    !Number.isInteger(completedTasks) ||
    completedTasks < 0 ||
    completedTasks > totalTasks
) {
    console.log("Ошибка: некорректные данные.");
} else if (
    !Number.isInteger(dailyLimit) ||
    dailyLimit < 1 ||
    dailyLimit > 1000
) {
    console.log("Ошибка: дневная норма должна быть целым числом от 1 до 1000.");
} else {
    let remainingTasks = totalTasks - completedTasks;
    let day = 0;

    if (remainingTasks === 0) {
        console.log("Осталось задач: 0");
        console.log("Потребуется дней: 0");
    } else {
        console.log("Осталось задач:", remainingTasks);

        while (remainingTasks > 0) {
            day++;

            const completedToday = Math.min(dailyLimit, remainingTasks);
            remainingTasks -= completedToday;

            console.log(
                `День ${day}: выполнено ${completedToday}, осталось ${remainingTasks}`
            );
        }

        console.log("Потребуется дней:", day);
    }
}