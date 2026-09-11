const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInputObjectType
} = require('graphql');
const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Pangelina361!',
    server: 'localhost',
    database: 'PAS',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const connect = async () => {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('DB Connection Error:', err);
    }
};

// === GraphQL Types ===
const FacultyType = new GraphQLObjectType({
    name: 'Faculty',
    fields: () => ({
        faculty: { type: GraphQLString },
        faculty_name: { type: GraphQLString },
    }),
});

const PulpitType = new GraphQLObjectType({
    name: 'Pulpit',
    fields: () => ({
        pulpit: { type: GraphQLString },
        pulpit_name: { type: GraphQLString },
        faculty: { type: GraphQLString },
    }),
});

const TeacherType = new GraphQLObjectType({
    name: 'Teacher',
    fields: () => ({
        teacher: { type: GraphQLString },
        teacher_name: { type: GraphQLString },
        pulpit: { type: GraphQLString },
    }),
});

const SubjectType = new GraphQLObjectType({
    name: 'Subject',
    fields: () => ({
        subject: { type: GraphQLString },
        subject_name: { type: GraphQLString },
        pulpit: { type: GraphQLString },
    }),
});

const FacultyInput = new GraphQLInputObjectType({
    name: 'FacultyInput',
    fields: {
        faculty: { type: GraphQLString },
        faculty_name: { type: GraphQLString },
    },
});

const PulpitInput = new GraphQLInputObjectType({
    name: 'PulpitInput',
    fields: {
        pulpit: { type: GraphQLString },
        pulpit_name: { type: GraphQLString },
        faculty: { type: GraphQLString },
    },
});

const TeacherInput = new GraphQLInputObjectType({
    name: 'TeacherInput',
    fields: {
        teacher: { type: GraphQLString },
        teacher_name: { type: GraphQLString },
        pulpit: { type: GraphQLString },
    },
});

const SubjectInput = new GraphQLInputObjectType({
    name: 'SubjectInput',
    fields: {
        subject: { type: GraphQLString },
        subject_name: { type: GraphQLString },
        pulpit: { type: GraphQLString },
    },
});

// === Root Query ===
const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        getFaculties: {
            type: new GraphQLList(FacultyType),
            args: { faculty: { type: GraphQLString } },
            async resolve(_, { faculty }) {
                const pool = await connect();
                const result = await pool.request().query(
                    faculty ? `SELECT * FROM faculty WHERE faculty = '${faculty}'` : 'SELECT * FROM faculty'
                );
                return result.recordset;
            },
        },
        getPulpits: {
            type: new GraphQLList(PulpitType),
            args: { pulpit: { type: GraphQLString } },
            async resolve(_, { pulpit }) {
                const pool = await connect();
                const result = await pool.request().query(
                    pulpit ? `SELECT * FROM pulpit WHERE pulpit = '${pulpit}'` : 'SELECT * FROM pulpit'
                );
                return result.recordset;
            },
        },
        getTeachers: {
            type: new GraphQLList(TeacherType),
            args: { teacher: { type: GraphQLString } },
            async resolve(_, { teacher }) {
                const pool = await connect();
                const result = await pool.request().query(
                    teacher ? `SELECT * FROM teacher WHERE teacher = '${teacher}'` : 'SELECT * FROM teacher'
                );
                return result.recordset;
            },
        },
        getSubjects: {
            type: new GraphQLList(SubjectType),
            args: { subject: { type: GraphQLString } },
            async resolve(_, { subject }) {
                const pool = await connect();
                const result = await pool.request().query(
                    subject ? `SELECT * FROM subject WHERE subject = '${subject}'` : 'SELECT * FROM subject'
                );
                return result.recordset;
            },
        },
        getTeachersByFaculty: {
            type: new GraphQLList(TeacherType),
            args: { faculty: { type: GraphQLString } },
            async resolve(_, { faculty }) {
                const pool = await connect();
                const result = await pool.request().query(`
          SELECT t.* FROM teacher t
          JOIN pulpit p ON t.pulpit = p.pulpit
          WHERE p.faculty = '${faculty}'
        `);
                return result.recordset;
            },
        },
        getSubjectsByFaculties: {
            type: new GraphQLList(SubjectType),
            args: { faculty: { type: GraphQLString } },
            async resolve(_, { faculty }) {
                const pool = await connect();
                const result = await pool.request().query(`
          SELECT s.* FROM subject s
          JOIN pulpit p ON s.pulpit = p.pulpit
          WHERE p.faculty = '${faculty}'
        `);
                return result.recordset;
            },
        },
    },
});

// === Mutations ===
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        setFaculty: {
            type: FacultyType,
            args: { faculty: { type: FacultyInput } },
            async resolve(_, { faculty }) {
                const pool = await connect();
                const result = await pool.request().query(`
          MERGE faculty AS target
          USING (SELECT '${faculty.faculty}' AS faculty) AS source
          ON target.faculty = source.faculty
          WHEN MATCHED THEN UPDATE SET faculty_name = N'${faculty.faculty_name}'
          WHEN NOT MATCHED THEN INSERT (faculty, faculty_name) VALUES ('${faculty.faculty}', N'${faculty.faculty_name}');
        `);
                return faculty;
            },
        },
        setPulpit: {
            type: PulpitType,
            args: { pulpit: { type: PulpitInput } },
            async resolve(_, { pulpit }) {
                const pool = await connect();
                await pool.request().query(`
          MERGE pulpit AS target
          USING (SELECT '${pulpit.pulpit}' AS pulpit) AS source
          ON target.pulpit = source.pulpit
          WHEN MATCHED THEN UPDATE SET pulpit_name = N'${pulpit.pulpit_name}', faculty = '${pulpit.faculty}'
          WHEN NOT MATCHED THEN INSERT (pulpit, pulpit_name, faculty) VALUES ('${pulpit.pulpit}', N'${pulpit.pulpit_name}', '${pulpit.faculty}');
        `);
                return pulpit;
            },
        },
        setTeacher: {
            type: TeacherType,
            args: { teacher: { type: TeacherInput } },
            async resolve(_, { teacher }) {
                const pool = await connect();
                await pool.request().query(`
          MERGE teacher AS target
          USING (SELECT '${teacher.teacher}' AS teacher) AS source
          ON target.teacher = source.teacher
          WHEN MATCHED THEN UPDATE SET teacher_name = N'${teacher.teacher_name}', pulpit = '${teacher.pulpit}'
          WHEN NOT MATCHED THEN INSERT (teacher, teacher_name, pulpit) VALUES ('${teacher.teacher}', N'${teacher.teacher_name}', '${teacher.pulpit}');
        `);
                return teacher;
            },
        },
        setSubject: {
            type: SubjectType,
            args: { subject: { type: SubjectInput } },
            async resolve(_, { subject }) {
                const pool = await connect();
                await pool.request().query(`
          MERGE subject AS target
          USING (SELECT '${subject.subject}' AS subject) AS source
          ON target.subject = source.subject
          WHEN MATCHED THEN UPDATE SET subject_name = N'${subject.subject_name}', pulpit = '${subject.pulpit}'
          WHEN NOT MATCHED THEN INSERT (subject, subject_name, pulpit) VALUES ('${subject.subject}', N'${subject.subject_name}', '${subject.pulpit}');
        `);
                return subject;
            },
        },
        delFaculty: {
            type: GraphQLBoolean,
            args: { faculty: { type: GraphQLString } },
            async resolve(_, { faculty }) {
                const pool = await connect();
                const result = await pool.request().query(`DELETE FROM faculty WHERE faculty = '${faculty}'`);
                return result.rowsAffected[0] > 0;
            },
        },
        delPulpit: {
            type: GraphQLBoolean,
            args: { pulpit: { type: GraphQLString } },
            async resolve(_, { pulpit }) {
                const pool = await connect();
                const result = await pool.request().query(`DELETE FROM pulpit WHERE pulpit = '${pulpit}'`);
                return result.rowsAffected[0] > 0;
            },
        },
        delTeacher: {
            type: GraphQLBoolean,
            args: { teacher: { type: GraphQLString } },
            async resolve(_, { teacher }) {
                const pool = await connect();
                const result = await pool.request().query(`DELETE FROM teacher WHERE teacher = '${teacher}'`);
                return result.rowsAffected[0] > 0;
            },
        },
        delSubject: {
            type: GraphQLBoolean,
            args: { subject: { type: GraphQLString } },
            async resolve(_, { subject }) {
                const pool = await connect();
                const result = await pool.request().query(`DELETE FROM subject WHERE subject = '${subject}'`);
                return result.rowsAffected[0] > 0;
            },
        },
    },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

// === Server start ===
const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(3000, () => console.log('GraphQL API server running at http://localhost:3000/graphql'));
