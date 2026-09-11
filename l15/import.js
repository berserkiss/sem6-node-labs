require("dotenv").config();
const mongoose = require("mongoose");

const Faculty = require("./models/Faculty");
const Pulpit = require("./models/Pulpit");

const uri = process.env.MONGO_URI;

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Подключено к MongoDB");

        await Faculty.insertMany([
            { faculty: "ИЭ", faculty_name: "Инженерно-экономический" },
            { faculty: "ИТ", faculty_name: "Информационных технологий" },
        ]);

        console.log("Данные faculty добавлены");

        await Pulpit.insertMany([
            {
                pulpit: "ИСиТ",
                pulpit_name: "Информационных систем и технологий",
                faculty: "ИТ",
            },
            {
                pulpit: "ПИ",
                pulpit_name: "Программной инженерии",
                faculty: "ИТ",
            },
        ]);

        console.log("Данные pulpit добавлены");
    } catch (err) {
        console.error("Ошибка:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Соединение закрыто");
    }
}

run();
