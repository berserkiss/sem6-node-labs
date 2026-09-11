const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Pangelina361!',
    server: 'localhost',
    database: 'UsersDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const userModel = {
    getAllUsers: async () => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().query('SELECT * FROM Users');
            return result.recordset;
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Users WHERE Id = @id');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    },

    createUser: async (user) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('name', sql.NVarChar, user.name)
                .input('email', sql.NVarChar, user.email)
                .query('INSERT INTO Users (Name, Email) OUTPUT INSERTED.* VALUES (@name, @email)');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (id, user) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('id', sql.Int, id)
                .input('name', sql.NVarChar, user.name)
                .input('email', sql.NVarChar, user.email)
                .query('UPDATE Users SET Name = @name, Email = @email OUTPUT INSERTED.* WHERE Id = @id');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Users WHERE Id = @id');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userModel;