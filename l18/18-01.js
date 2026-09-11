const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const port = 3000;

// Настройки подключения к SQL Server через Sequelize
const sequelize = new Sequelize("PAS", "sa", "Pangelina361!", {
    host: "localhost",
    dialect: "mssql",
    dialectOptions: {
        options: {
            encrypt: false,
            enableArithAbort: true
        }
    },
    logging: console.log // Включаем логирование для отладки
});

// Определение моделей с явным указанием соответствий
const AuditoriumType = sequelize.define("auditorium_type", {
    auditorium_type: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        field: 'auditorium_type'
    },
    auditorium_typename: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: 'auditorium_typename'
    }
}, {
    tableName: 'auditorium_type',
    timestamps: false
});

const Faculty = sequelize.define("faculty", {
    faculty: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        field: 'faculty'
    },
    faculty_name: {
        type: DataTypes.STRING(200),
        field: 'faculty_name'
    }
}, {
    tableName: 'faculty',
    timestamps: false
});

const Pulpit = sequelize.define("pulpit", {
    pulpit: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        field: 'pulpit'
    },
    pulpit_name: {
        type: DataTypes.STRING(200),
        field: 'pulpit_name'
    },
    faculty: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        field: 'faculty'
    }
}, {
    tableName: 'pulpit',
    timestamps: false
});

const Teacher = sequelize.define("teacher", {
    teacher: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        field: 'teacher'
    },
    teacher_name: {
        type: DataTypes.STRING(200),
        field: 'teacher_name'
    },
    pulpit: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        field: 'pulpit'
    }
}, {
    tableName: 'teacher',
    timestamps: false
});

const Subject = sequelize.define("subject", {
    subject: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        field: 'subject'
    },
    subject_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'subject_name'
    },
    pulpit: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        field: 'pulpit'
    }
}, {
    tableName: 'subject',
    timestamps: false
});

const Auditorium = sequelize.define("auditorium", {
    auditorium: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        field: 'auditorium'
    },
    auditorium_name: {
        type: DataTypes.STRING(200),
        field: 'auditorium_name'
    },
    auditorium_capacity: {
        type: DataTypes.INTEGER,
        field: 'auditorium_capacity'
    },
    auditorium_type: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        field: 'auditorium_type'
    }
}, {
    tableName: 'auditorium',
    timestamps: false
});

// Установка ассоциаций
Faculty.hasMany(Pulpit, {
    foreignKey: 'faculty',
    sourceKey: 'faculty',
    onDelete: 'CASCADE'
});
Pulpit.belongsTo(Faculty, {
    foreignKey: 'faculty',
    targetKey: 'faculty',
    as: 'facultyData'
});

Pulpit.hasMany(Teacher, {
    foreignKey: 'pulpit',
    sourceKey: 'pulpit',
    onDelete: 'CASCADE'
});
Teacher.belongsTo(Pulpit, {
    foreignKey: 'pulpit',
    targetKey: 'pulpit',
    as: 'pulpitData'
});

Pulpit.hasMany(Subject, {
    foreignKey: 'pulpit',
    sourceKey: 'pulpit',
    onDelete: 'CASCADE'
});
Subject.belongsTo(Pulpit, {
    foreignKey: 'pulpit',
    targetKey: 'pulpit',
    as: 'pulpitData'
});

AuditoriumType.hasMany(Auditorium, {
    foreignKey: 'auditorium_type',
    sourceKey: 'auditorium_type',
    onDelete: 'CASCADE'
});
Auditorium.belongsTo(AuditoriumType, {
    foreignKey: 'auditorium_type',
    targetKey: 'auditorium_type',
    as: 'auditoriumTypeData'
});
// Функции валидации
const validateFacultyData = (data) => {
    if (!data.faculty || !data.faculty_name) {
        return "Faculty and Faculty name are required";
    }
    return null;
};

const validatePulpitData = (data) => {
    if (!data.pulpit || !data.pulpit_name || !data.faculty) {
        return "Pulpit, Pulpit name, and Faculty are required";
    }
    return null;
};

const validateSubjectData = (data) => {
    if (!data.subject || !data.subject_name || !data.pulpit) {
        return "Subject, Subject name, and Pulpit are required";
    }
    return null;
};

const validateAuditoriumData = (data) => {
    if (!data.auditorium || !data.auditorium_name || !data.auditorium_capacity || !data.auditorium_type) {
        return "Auditorium, Auditorium name, Auditorium capacity, and Auditorium type are required";
    }
    if (isNaN(data.auditorium_capacity) || data.auditorium_capacity <= 0) {
        return "Auditorium capacity must be a positive number";
    }
    return null;
};

const validateAuditoriumTypeData = (data) => {
    if (!data.auditorium_type || !data.auditorium_typename) {
        return "Auditorium type, typename are required";
    }
    return null;
};

// Функция для отправки JSON-ответа
const sendJsonResponse = (res, data, statusCode = 200) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
};

// Функция для отправки статического HTML-файла
const sendHtmlResponse = (res, filePath) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error reading HTML file");
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        }
    });
};

// Функция обработки GET-запросов с использованием Sequelize
const handleGetRequest = async (req, res, pathname) => {
    try {
        if (pathname === "/") {
            const filePath = path.join(__dirname, "14-02.html");
            sendHtmlResponse(res, filePath);
        } else {
            let result;
            switch (pathname) {
                case "/api/faculties":
                    result = await Faculty.findAll();
                    sendJsonResponse(res, result);
                    break;
                case "/api/pulpits":
                    result = await Pulpit.findAll();
                    sendJsonResponse(res, result);
                    break;
                case "/api/subjects":
                    result = await Subject.findAll();
                    sendJsonResponse(res, result);
                    break;
                case "/api/auditoriumstypes":
                    result = await AuditoriumType.findAll();
                    sendJsonResponse(res, result);
                    break;
                case "/api/auditoriums":
                    result = await Auditorium.findAll();
                    sendJsonResponse(res, result);
                    break;
                default:
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("Not Found");
            }
        }
    } catch (err) {
        sendJsonResponse(res, { error: err.message }, 500);
    }
};

// Функция для обработки POST-запросов с использованием Sequelize
const handlePostRequest = async (req, res, pathname, body) => {
    try {
        let validationError;
        let result;

        switch (pathname) {
            case "/api/faculties":
                validationError = validateFacultyData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Faculty.create(body);
                sendJsonResponse(res, result, 201);
                break;
            case "/api/pulpits":
                validationError = validatePulpitData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Pulpit.create(body);
                sendJsonResponse(res, result, 201);
                break;
            case "/api/subjects":
                validationError = validateSubjectData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Subject.create(body);
                sendJsonResponse(res, result, 201);
                break;
            case "/api/auditoriumstypes":
                validationError = validateAuditoriumTypeData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await AuditoriumType.create(body);
                sendJsonResponse(res, result, 201);
                break;
            case "/api/auditoriums":
                validationError = validateAuditoriumData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Auditorium.create(body);
                sendJsonResponse(res, result, 201);
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Not Found");
        }
    } catch (err) {
        sendJsonResponse(res, { error: err.message }, 500);
    }
};

// Функция для обработки PUT-запросов с использованием Sequelize
const handlePutRequest = async (req, res, pathname, body) => {
    try {
        let validationError;
        let result;
        let whereCondition;

        switch (pathname) {
            case "/api/faculties":
                validationError = validateFacultyData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Faculty.update(body, {
                    where: { faculty: body.faculty },
                    returning: true
                });
                if (result[0] === 0) {
                    return sendJsonResponse(res, { error: "Faculty not found" }, 404);
                }
                sendJsonResponse(res, await Faculty.findByPk(body.faculty));
                break;
            case "/api/pulpits":
                validationError = validatePulpitData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Pulpit.update(body, {
                    where: { pulpit: body.pulpit },
                    returning: true
                });
                if (result[0] === 0) {
                    return sendJsonResponse(res, { error: "Pulpit not found" }, 404);
                }
                sendJsonResponse(res, await Pulpit.findByPk(body.pulpit));
                break;
            case "/api/subjects":
                validationError = validateSubjectData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Subject.update(body, {
                    where: { subject: body.subject },
                    returning: true
                });
                if (result[0] === 0) {
                    return sendJsonResponse(res, { error: "Subject not found" }, 404);
                }
                sendJsonResponse(res, await Subject.findByPk(body.subject));
                break;
            case "/api/auditoriumstypes":
                validationError = validateAuditoriumTypeData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await AuditoriumType.update(body, {
                    where: { auditorium_type: body.auditorium_type },
                    returning: true
                });
                if (result[0] === 0) {
                    return sendJsonResponse(res, { error: "Auditorium type not found" }, 404);
                }
                sendJsonResponse(res, await AuditoriumType.findByPk(body.auditorium_type));
                break;
            case "/api/auditoriums":
                validationError = validateAuditoriumData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                result = await Auditorium.update(body, {
                    where: { auditorium: body.auditorium },
                    returning: true
                });
                if (result[0] === 0) {
                    return sendJsonResponse(res, { error: "Auditorium not found" }, 404);
                }
                sendJsonResponse(res, await Auditorium.findByPk(body.auditorium));
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Not Found");
        }
    } catch (err) {
        sendJsonResponse(res, { error: err.message }, 500);
    }
};

// Функция для обработки DELETE-запросов с использованием Sequelize
const handleDeleteRequest = async (req, res, pathname) => {
    try {
        const id = pathname.split('/')[3];

        if (!id) {
            sendJsonResponse(res, { error: 'ID is required for deletion' }, 400);
            return;
        }

        let model;
        let deletedRecord;

        switch (pathname.split('/')[2]) {
            case "faculties":
                model = Faculty;
                break;
            case "pulpits":
                model = Pulpit;
                break;
            case "subjects":
                model = Subject;
                break;
            case "auditoriumtypes":
                model = AuditoriumType;
                break;
            case "auditoriums":
                model = Auditorium;
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Not Found");
                return;
        }

        // Находим запись перед удалением
        deletedRecord = await model.findByPk(id);
        if (!deletedRecord) {
            sendJsonResponse(res, { error: `Record with ID ${id} not found` }, 404);
            return;
        }

        // Удаляем запись
        await model.destroy({ where: { [model.primaryKeyAttribute]: id } });

        // Возвращаем удаленную запись
        sendJsonResponse(res, deletedRecord);

    } catch (err) {
        sendJsonResponse(res, { error: err.message }, 500);
    }
};

// Создание сервера
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    if (req.method === "GET") {
        await handleGetRequest(req, res, pathname);
    } else if (req.method === "POST" || req.method === "PUT") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", async () => {
            try {
                const parsedBody = JSON.parse(body);
                if (req.method === "POST") {
                    await handlePostRequest(req, res, pathname, parsedBody);
                } else if (req.method === "PUT") {
                    await handlePutRequest(req, res, pathname, parsedBody);
                }
            } catch (err) {
                sendJsonResponse(res, { error: "Invalid JSON format" }, 400);
            }
        });
    } else if (req.method === "DELETE") {
        await handleDeleteRequest(req, res, pathname);
    } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
    }
});

// Проверка подключения к базе данных и запуск сервера
sequelize.authenticate()
    .then(() => {
        console.log("Connection to the database has been established successfully.");

        // Синхронизация моделей с базой данных
        return sequelize.sync();
    })
    .then(() => {
        console.log("Models synchronized with database.");

        // Запуск сервера
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });