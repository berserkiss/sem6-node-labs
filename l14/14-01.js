const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const sql = require("mssql");

const port = 3000;

// Настройки подключения к SQL Server
const config = {
    user: "sa",
    password: "Pangelina361!",
    server: "localhost",
    database: "PAS",
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

// Создание пула соединений
const poolPromise = new sql.ConnectionPool(config).connect();

sql.connect(config).then(pool => {
    console.log("Connected to the database!");
}).catch(err => {
    console.error("Database connection error: ", err);
});

// Функция для валидации данных факультета
const validateFacultyData = (data) => {
    if (!data.faculty || !data.faculty_name) {
        return "Faculty and Faculty name are required";
    }
    return null;
};

// Функция для валидации данных кафедры
const validatePulpitData = (data) => {
    if (!data.pulpit || !data.pulpit_name || !data.faculty) {
        return "Pulpit, Pulpit name, and Faculty are required";
    }
    return null;
};

// Функция для валидации данных предмета
const validateSubjectData = (data) => {
    if (!data.subject || !data.subject_name || !data.pulpit) {
        return "Subject, Subject name, and Pulpit are required";
    }
    return null;
};

// Функция для валидации данных аудитории
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

// Функция обработки GET-запросов
const handleGetRequest = async (req, res, pathname) => {
    try {
        if (pathname === "/") {
            const filePath = path.join(__dirname, "14-02.html");
            sendHtmlResponse(res, filePath);
        } else {
            const pool = await poolPromise;
            let result;
            switch (pathname) {
                case "/api/faculties":
                    result = await pool.request().query("SELECT * FROM faculty");
                    sendJsonResponse(res, result.recordset);
                    break;
                case "/api/pulpits":
                    result = await pool.request().query("SELECT * FROM pulpit");
                    sendJsonResponse(res, result.recordset);
                    break;
                case "/api/subjects":
                    result = await pool.request().query("SELECT * FROM subject");
                    sendJsonResponse(res, result.recordset);
                    break;
                case "/api/auditoriumstypes":
                    result = await pool.request().query("SELECT * FROM auditorium_type");
                    sendJsonResponse(res, result.recordset);
                    break;
                case "/api/auditoriums":
                    result = await pool.request().query("SELECT * FROM auditorium");
                    sendJsonResponse(res, result.recordset);
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

// Функция для обработки POST-запросов
const handlePostRequest = async (req, res, pathname, body) => {
    try {
        let query;
        let result;
        let validationError;

        switch (pathname) {
            case "/api/faculties":
                validationError = validateFacultyData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `INSERT INTO faculty (faculty, faculty_name) OUTPUT INSERTED.faculty, INSERTED.faculty_name VALUES ('${body.faculty}', '${body.faculty_name}')`;
                break;
            case "/api/pulpits":
                validationError = validatePulpitData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `INSERT INTO pulpit (pulpit, pulpit_name, faculty) OUTPUT INSERTED.pulpit, INSERTED.pulpit_name, INSERTED.faculty VALUES ('${body.pulpit}', '${body.pulpit_name}', '${body.faculty}')`;
                break;
            case "/api/subjects":
                validationError = validateSubjectData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `INSERT INTO subject (subject, subject_name, pulpit) OUTPUT INSERTED.subject, INSERTED.subject_name, INSERTED.pulpit VALUES ('${body.subject}', '${body.subject_name}', '${body.pulpit}')`;
                break;
            case "/api/auditoriumstypes":
                validationError = validateAuditoriumTypeData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `INSERT INTO auditorium_type (auditorium_type, auditorium_typename) OUTPUT INSERTED.auditorium_type, INSERTED.auditorium_typename VALUES ('${body.auditorium_type}', '${body.auditorium_typename}')`;
                break;
            case "/api/auditoriums":
                validationError = validateAuditoriumData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `INSERT INTO auditorium (auditorium, auditorium_name, auditorium_capacity, auditorium_type) OUTPUT INSERTED.auditorium, INSERTED.auditorium_name, INSERTED.auditorium_capacity, INSERTED.auditorium_type VALUES ('${body.auditorium}', '${body.auditorium_name}', ${body.auditorium_capacity}, '${body.auditorium_type}')`;
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Not Found");
                return;
        }

        result = await sql.query(query);
        sendJsonResponse(res, result.recordset[0], 201);  // Возвращаем добавленные данные
    } catch (err) {
        sendJsonResponse(res, { error: err.message }, 500);  // Сообщение об ошибке
    }
};

// Функция для обработки PUT-запросов
const handlePutRequest = async (req, res, pathname, body) => {
    try {
        let query;
        let result;
        let validationError;

        switch (pathname) {
            case "/api/faculties":
                validationError = validateFacultyData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `UPDATE faculty SET faculty_name = '${body.faculty_name}' OUTPUT INSERTED.faculty, INSERTED.faculty_name WHERE faculty = '${body.faculty}'`;
                break;
            case "/api/pulpits":
                validationError = validatePulpitData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `UPDATE pulpit SET pulpit_name = '${body.pulpit_name}', faculty = '${body.faculty}' OUTPUT INSERTED.pulpit, INSERTED.pulpit_name, INSERTED.faculty WHERE pulpit = '${body.pulpit}'`;
                break;
            case "/api/subjects":
                validationError = validateSubjectData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `UPDATE subject SET subject_name = '${body.subject_name}', pulpit = '${body.pulpit}' OUTPUT INSERTED.subject, INSERTED.subject_name, INSERTED.pulpit WHERE subject = '${body.subject}'`;
                break;
            case "/api/auditoriumstypes":
                validationError = validateAuditoriumTypeData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `UPDATE auditorium_type SET auditorium_typename = '${body.auditorium_typename}' OUTPUT INSERTED.auditorium_type, INSERTED.auditorium_typename WHERE auditorium_type = '${body.auditorium_type}'`;
                break;
            case "/api/auditoriums":
                validationError = validateAuditoriumData(body);
                if (validationError) return sendJsonResponse(res, { error: validationError }, 400);
                query = `UPDATE auditorium SET auditorium_name = '${body.auditorium_name}', auditorium_capacity = ${body.auditorium_capacity}, auditorium_type = '${body.auditorium_type}' OUTPUT INSERTED.auditorium, INSERTED.auditorium_name, INSERTED.auditorium_capacity, INSERTED.auditorium_type WHERE auditorium = '${body.auditorium}'`;
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Not Found");
                return;
        }

        result = await sql.query(query);

        if (result.rowsAffected[0] > 0) {
            // Возвращаем измененные данные
            sendJsonResponse(res, result.recordset[0]);
        } else {
            // Если ничего не изменилось (запись не найдена)
            sendJsonResponse(res, { error: "Record not found or no changes made" }, 404);
        }
    } catch (err) {
        sendJsonResponse(res, { error: err.message }, 500);  // Сообщение об ошибке
    }
};



// Функция для обработки DELETE-запросов
const handleDeleteRequest = async (req, res, pathname) => {
    try {
        const id = pathname.split('/')[3];  // Получаем идентификатор из URL (например, для /api/faculties/xyz получим xyz)

        if (!id) {
            sendJsonResponse(res, { error: 'ID is required for deletion' }, 400);
            return;
        }

        const pool = await poolPromise;
        let selectQuery;
        let deleteQuery;
        let result;

        // Определяем соответствующие запросы в зависимости от ресурса
        switch (pathname.split('/')[2]) {
            case "faculties":
                selectQuery = `SELECT * FROM faculty WHERE faculty = '${id}'`;
                deleteQuery = `DELETE FROM faculty WHERE faculty = '${id}'`;
                break;
            case "pulpits":
                selectQuery = `SELECT * FROM pulpit WHERE pulpit = '${id}'`;
                deleteQuery = `DELETE FROM pulpit WHERE pulpit = '${id}'`;
                break;
            case "subjects":
                selectQuery = `SELECT * FROM subject WHERE subject = '${id}'`;
                deleteQuery = `DELETE FROM subject WHERE subject = '${id}'`;
                break;
            case "auditoriumtypes":
                selectQuery = `SELECT * FROM auditorium_type WHERE auditorium_type = '${id}'`;
                deleteQuery = `DELETE FROM auditorium_type WHERE auditorium_type = '${id}'`;
                break;
            case "auditoriums":
                selectQuery = `SELECT * FROM auditorium WHERE auditorium = '${id}'`;
                deleteQuery = `DELETE FROM auditorium WHERE auditorium = '${id}'`;
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Not Found");
                return;
        }

        // Сначала получаем запись
        const selectResult = await pool.request().query(selectQuery);

        if (selectResult.recordset.length === 0) {
            sendJsonResponse(res, { error: `Record with ID ${id} not found` }, 404);
            return;
        }

        const deletedRecord = selectResult.recordset[0];

        // Затем удаляем запись
        await pool.request().query(deleteQuery);

        // Возвращаем удаленную запись
        sendJsonResponse(res, deletedRecord);

    } catch (err) {
        sendJsonResponse(res, { error: err.message }, 500);  // Сообщение об ошибке
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
    }else if (req.method === "DELETE") {
        await handleDeleteRequest(req, res, pathname);
    }else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
    }
});

// Запуск сервера
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
