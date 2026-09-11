const mongoose = require('mongoose');
const Pet = require('./models/Pet');
require('dotenv').config();

const samplePets = [
    {
        name: "Барсик",
        type: "Кошка",
        breed: "Британская",
        age: 2,
        gender: "Male",
        description: "Ласковый и игривый кот",
        image: "uploads/barsik.jpg",
        status: "available"
    },
    {
        name: "Шарик",
        type: "Собака",
        breed: "Лабрадор",
        age: 3,
        gender: "Male",
        description: "Дружелюбная и активная собака",
        image: "uploads/sharik.jpg",
        status: "available"
    },
    {
        name: "Мурка",
        type: "Кошка",
        breed: "Дворовая",
        age: 1,
        gender: "Female",
        description: "Спокойная и нежная кошка",
        image: "uploads/barsik.jpg",
        status: "available"
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Очистка коллекции (опционально)
        await Pet.deleteMany({});

        // Добавление тестовых данных
        await Pet.insertMany(samplePets);
        console.log('Test pets added successfully');
        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });