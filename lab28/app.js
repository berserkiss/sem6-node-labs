const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json());

// Mock database
let phoneDirectory = [
    { id: '1', name: 'John Doe', phone: '+1234567890' },
    { id: '2', name: 'Jane Smith', phone: '+0987654321' }
];

// API endpoints
app.get('/TS', (req, res) => {
    res.json(phoneDirectory);
});

app.post('/TS', (req, res) => {
    const newEntry = req.body;
    phoneDirectory.push(newEntry);
    res.status(201).send('Entry created');
});

app.put('/TS', (req, res) => {
    const updatedEntry = req.body;
    const index = phoneDirectory.findIndex(entry => entry.id === updatedEntry.id);
    if (index !== -1) {
        phoneDirectory[index] = updatedEntry;
        res.send('Entry updated');
    } else {
        res.status(404).send('Entry not found');
    }
});

app.delete('/TS', (req, res) => {
    const { id } = req.body;
    phoneDirectory = phoneDirectory.filter(entry => entry.id !== id);
    res.send('Entry deleted');
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});