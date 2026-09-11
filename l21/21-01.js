const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const { users } = require('./auth.json');

const app = express();
const PORT = 4000;

// Настройка Basic стратегии без сессии
passport.use(new BasicStrategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    return done(null, user || false);
}));

// Middleware проверки аутентификации
const requireAuth = passport.authenticate('basic', { session: false });

// /login — запрашивает имя и пароль (Basic Auth)
app.get('/login', requireAuth, (req, res) => {
    res.send(`Authenticated as ${req.user.username}`);
});

// /logout — просто редирект на /login (нет сессий)
app.get('/logout', (req, res) => {
    res.redirect('/login');
});

// /resource — требует Basic-аутентификацию каждый раз
app.get('/resource', requireAuth, (req, res) => {
    res.send('RESOURCE');
});

// Все остальные маршруты → 404
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Старт сервера
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
