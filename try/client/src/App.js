import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css'; // Подключите стили

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <div>Pet Adoption</div>
                    <div>
                        <a href="/login">Login</a>
                        <a href="/signup">Signup</a>
                    </div>
                </nav>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
                <footer className="footer">
                    <p>&copy; 2025 Pet Adoption. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;