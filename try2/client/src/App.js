import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PetList from "./components/PetList";
import PetDetail from "./components/PetDetail";
import { AuthProvider } from "./context/AuthContext";
import { PetsProvider } from "./context/PetsContext";
import {ProtectedRoute} from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <PetsProvider>
                <Router>
                    <div className="app">
                        <Navbar />

                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/pets" element={<PetList />} />
                                <Route path="/pets/:id" element={<PetDetail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/success" element={
                                    <div className="success-page">
                                        <h2>Application Submitted!</h2>
                                        <p>Your adoption request has been received.</p>
                                    </div>
                                } />
                            </Routes>
                        </main>

                        <Footer />
                    </div>
                </Router>
            </PetsProvider>
        </AuthProvider>
    );
}

export default App;