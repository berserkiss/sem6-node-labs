import React from "react";
import { Link } from "react-router-dom";
import { usePets } from "../context/PetsContext";

const PetList = () => {
    const { pets, loading, error, fetchPets } = usePets();

    if (loading) return <div className="loading">Loading pets...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="pet-list">
            <div className="pet-list-header">
                <h2>Available Pets</h2>
            </div>

            <div className="pets-container">
                {pets.length > 0 ? (
                    pets.map((pet) => (
                        <div key={pet._id} className="pet-card">
                            <div className="pet-image-container">
                                <img
                                    src={`http://localhost:5000/${pet.image}`}
                                    alt={pet.name}
                                    onError={(e) => {
                                        e.target.src = '/default-pet.jpg';
                                    }}
                                />
                                {pet.status !== "available" && (
                                    <div className={`status-badge ${pet.status}`}>
                                        {pet.status}
                                    </div>
                                )}
                            </div>
                            <div className="pet-info">
                                <h3>{pet.name}</h3>
                                <p>
                                    <span className="pet-type">{pet.type}</span> •
                                    <span className="pet-age"> {pet.age} years old</span>
                                </p>
                                <Link
                                    to={`/pets/${pet._id}`}
                                    className={`btn ${pet.status !== "available" ? "disabled" : ""}`}
                                >
                                    {pet.status === "available" ? "View Details" : "Already Adopted"}
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-pets">
                        <p>No pets available for adoption at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetList;