const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const users = require('./users');

const app = express();
const PORT = 2000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'formSecretKey',
	resave: false,
	saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

// Custom Forms Authentication Middleware
function formsAuth(req, res, next) {
	if (req.session.user) return next();
	res.redirect('/login.html');
}

app.post('/login', (req, res) => {
	const { username, password } = req.body;
	const user = users.find(u => u.username === username && u.password === password);
	if (user) {
		req.session.user = user;
		res.redirect('/resource');
	} else {
		res.status(401).send('Invalid username or password');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy(() => {
		res.send('Logged out');
	});
});

app.get('/resource', formsAuth, (req, res) => {
	res.send(`Hello ${req.session.user.username}, this is your protected resource.`);
});

app.use((req, res) => {
	res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
	console.log(`Forms-auth server running on http://localhost:${PORT}`);
});
