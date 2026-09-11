import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [userApplications, setUserApplications] = useState([]);

    const [formData, setFormData] = useState({
        livingSituation: "",
        phoneNumber: "",
        previousExperience: "",
        familyComposition: ""
    });

    // Fetch pet details
    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/pets/${id}`);
                setPet(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load pet information");
                setLoading(false);
            }
        };

        fetchPet();
    }, [id]);

    // Fetch user's applications
    useEffect(() => {
        const fetchUserApplications = async () => {
            if (user) {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/users/my-applications`,
                        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );
                    setUserApplications(response.data);
                } catch (error) {
                    console.error("Error loading applications:", error);
                }
            }
        };
        fetchUserApplications();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.post(
                `http://localhost:5000/api/pets/${id}/adopt`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update user's applications list
            setUserApplications([...userApplications, response.data.application]);

            alert("Application submitted successfully!");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to submit application"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Check if user has application for this pet
    const hasApplicationForThisPet = userApplications.some(app => app.pet._id === id);

    if (loading) return <div className="loading">Loading pet information...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!pet) return <div className="not-found">Pet not found</div>;

    if (hasApplicationForThisPet) {
        const application = userApplications.find(app => app.pet._id === id);
        return (
            <div className="pet-detail-container">
                <div className="pet-images">
                    <img
                        src={`http://localhost:5000/${pet.image}`}
                        alt={pet.name}
                        onError={(e) => {
                            e.target.src = '/default-pet-large.jpg';
                        }}
                    />
                </div>

                <div className="pet-info">
                    <h1>{pet.name}</h1>
                    <div className="pet-meta">
                        <span className="pet-type">{pet.type}</span>
                        <span className="pet-age">{pet.age} years</span>
                        <span className="pet-gender">{pet.gender}</span>
                    </div>

                    <div className="pet-description">
                        <h3>About {pet.name}</h3>
                        <p>{pet.description}</p>
                    </div>

                    <div className="application-status">
                        <h3>Your Adoption Application</h3>
                        <p>You've already applied to adopt {pet.name}.</p>
                        <div className="application-details">
                            <p><strong>Submitted:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                            <p><strong>Status:</strong>
                                {application.status === "pending" && "Under review"}
                                {application.status === "approved" && "Approved"}
                                {application.status === "rejected" && "Rejected"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pet-detail-container">
            <div className="pet-images">
                <img
                    src={`http://localhost:5000/${pet.image}`}
                    alt={pet.name}
                    onError={(e) => {
                        e.target.src = '/default-pet-large.jpg';
                    }}
                />
            </div>

            <div className="pet-info">
                <h1>{pet.name}</h1>
                <div className="pet-meta">
                    <span className="pet-type">{pet.type}</span>
                    <span className="pet-age">{pet.age} years</span>
                    <span className="pet-gender">{pet.gender}</span>
                </div>

                <div className="pet-description">
                    <h3>About {pet.name}</h3>
                    <p>{pet.description}</p>
                </div>

                {user ? (
                    <form onSubmit={handleSubmit} className="adoption-form">
                        <h2>Adoption Application</h2>

                        {error && <div className="form-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="livingSituation">Your Living Situation:</label>
                            <textarea
                                id="livingSituation"
                                name="livingSituation"
                                value={formData.livingSituation}
                                onChange={handleChange}
                                required
                                placeholder="Describe your home (house/apartment, yard size, etc.)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="Your contact number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="previousExperience">
                                Previous Pet Experience:
                            </label>
                            <textarea
                                id="previousExperience"
                                name="previousExperience"
                                value={formData.previousExperience}
                                onChange={handleChange}
                                required
                                placeholder="Tell us about your experience with pets"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="familyComposition">
                                Family Composition:
                            </label>
                            <textarea
                                id="familyComposition"
                                name="familyComposition"
                                value={formData.familyComposition}
                                onChange={handleChange}
                                required
                                placeholder="Who lives with you? (adults, children, other pets)"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="submit-button"
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                    </form>
                ) : (
                    <div className="login-prompt">
                        <p>
                            Please <a href="/login">login</a> to apply for adopting {pet.name}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetDetail;