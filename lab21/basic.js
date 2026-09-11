/*
const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const session = require('express-session');
const users = require('./users');

const app = express();
const PORT = 3000;

//Ctrl + Shift + R
// Configure session
app.use(session({
	secret: 'secretKey',
	resave: false,
	saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport BasicStrategy
passport.use(new BasicStrategy(
	(username, password, done) => {
		const user = users.find(u => u.username === username && u.password === password);
		if (user) return done(null, user);
		return done(null, false);
	}
));

passport.serializeUser((user, done) => {
	done(null, user.username);
});

passport.deserializeUser((username, done) => {
	const user = users.find(u => u.username === username);
	done(null, user);
});

function ensureAuthenticated(req, res, next) {
	console.log(req.body)
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}

app.get('/login', passport.authenticate('basic', { session: true }), (req, res) => {
	console.log(req.body)
	res.send(`Logged in as ${req.user.username}`);
});

app.get('/logout', (req, res) => {
	req.logout(err => {
		if (err) return next(err);
		res.send('Logged out');
	});
});

app.get('/resource', ensureAuthenticated, (req, res) => {
	res.send('RESOURCE');
});

app.use((req, res) => {
	res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
	console.log(`Basic-auth Server running on http://localhost:${PORT}`);
});
*/
const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('./users');

const app = express();
const PORT = 5000;

// Настройка стратегии без сессий
passport.use(new BasicStrategy(
	(username, password, done) => {
		const user = users.find(u => u.username === username && u.password === password);
		if (user) return done(null, user);
		return done(null, false);
	}
));

// Middleware для проверки аутентификации
function ensureAuthenticated(req, res, next) {
	passport.authenticate('basic', { session: false })(req, res, next);
}

// /login — требует логин/пароль через окно браузера
app.get('/login', passport.authenticate('basic', { session: false }), (req, res) => {
	res.send(`Logged in as ${req.user.username}`);
});

// /logout — просто сообщает, что выхода нет (т.к. без сессии)
app.get('/logout', (req, res) => {
	res.send('You are logged out (close browser tab to end session)');
});

// /resource — доступен только после успешной аутентификации
app.get('/resource', ensureAuthenticated, (req, res) => {
	res.send('RESOURCE');
});

// Остальные маршруты — 404
app.use((req, res) => {
	res.status(404).send('404 Not Found');
});

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
