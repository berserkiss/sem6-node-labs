/*
query GetAllFaculties {
    getFaculties {
        faculty
        faculty_name
    }
}

query GetFacultyByCode {
    getFaculties(faculty: "htit") {
        faculty
        faculty_name
    }
}

query GetAllTeachers {
    getTeachers {
        teacher
        teacher_name
        pulpit
    }
}

query GetTeacherByCode {
    getTeachers(teacher: "urb") {
        teacher
        teacher_name
        pulpit
    }
}

query GetAllPulpits {
    getPulpits {
        pulpit
        pulpit_name
        faculty
    }
}


query GetPulpitByCode {
    getPulpits(pulpit: "etim") {
        pulpit
        pulpit_name
        faculty
    }
}


query GetAllSubjects {
    getSubjects {
        subject
        subject_name
        pulpit
    }
}


query GetSubjectByCode {
    getSubjects(subject: "bd") {
        subject
        subject_name
        pulpit
    }
}



query GetTeachersByFacultyCode {
    getTeachersByFaculty(faculty: "idip") {
        teacher
        teacher_name
        pulpit
    }
}

query GetSubjectsByFacultyCode {
    getSubjectsByFaculties(faculty: "idip") {
        subject
        subject_name
        pulpit
    }
}


# Mutation to add or update a faculty
mutation SetFaculty {
    setFaculty(faculty: { faculty: "example", faculty_name: "example Faculty" }) {
        faculty
        faculty_name
    }
}

# Mutation to add or update a pulpit
mutation SetPulpit {
    setPulpit(pulpit: { pulpit: "pulpit", pulpit_name: "Computer Science", faculty: "example" }) {
        pulpit
        pulpit_name
        faculty
    }
}


# Mutation to add or update a teacher
mutation SetTeacher {
    setTeacher(teacher: { teacher: "teacher2", teacher_name: "Johny", pulpit: "pulpit" }) {
        teacher
        teacher_name
        pulpit
    }
}

# Mutation to add or update a subject
mutation SetSubject {
    setSubject(subject: { subject: "subject", subject_name: "Mathematics", pulpit: "pulpit" }) {
        subject
        subject_name
        pulpit
    }
}

# Mutation to delete a faculty
mutation DelFaculty {
    delFaculty(faculty: "example")  # Replace "htit" with the actual faculty code
}


# Mutation to delete a pulpit
mutation DelPulpit {
    delPulpit(pulpit: "pulpit")  # Replace "pulpitCode" with the actual pulpit code
}


# Mutation to delete a teacher
mutation DelTeacher {
    delTeacher(teacher: "teacher2")  # Replace "teacherCode" with the actual teacher code
}

# Mutation to delete a subject
mutation DelSubject {
    delSubject(subject: "subject")  # Replace "subjectCode" with the actual subject code
}









*/
