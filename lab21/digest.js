const express = require('express');
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const users = require('./users');

const app = express();
const PORT = 3000;

// Настройка Digest стратегии (без сессий)
passport.use(new DigestStrategy({ qop: 'auth' },
	(username, done) => {
		const user = users.find(u => u.username === username);
		if (!user) return done(null, false);
		return done(null, user, user.password);
	},
	(params, done) => {
		done(null, true); // Не проверяем nonce, но можно
	}
));

app.use(passport.initialize());

// Middleware для защиты ресурса
const requireAuth = passport.authenticate('digest', { session: false });

// /login — требует авторизации, показывает кто вошёл
app.get('/login', requireAuth, (req, res) => {
	res.send(`Logged in as ${req.user.username}`);
});

// /logout — отсылает 401, чтобы заставить браузер забыть авторизацию
app.get('/logout', (req, res) => {
	res.set('WWW-Authenticate', 'Digest realm="Access to resource", qop="auth"');
	res.status(401).send('Logged out');
});

// /resource — защищённый ресурс
app.get('/resource', requireAuth, (req, res) => {
	res.send('PROTECTED RESOURCE');
});

// Все остальные маршруты — 404
app.use((req, res) => {
	res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
	console.log(`Digest-auth server running at http://localhost:${PORT}`);
});
