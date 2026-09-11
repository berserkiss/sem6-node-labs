import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PetsContext = createContext();

export const PetsProvider = ({ children }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pets');
            setPets(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch pets');
        } finally {
            setLoading(false);
        }
    };

    const updatePetStatus = (petId, newStatus) => {
        setPets(prevPets =>
            prevPets.map(pet =>
                pet._id === petId ? { ...pet, status: newStatus } : pet
            )
        );
    };

    useEffect(() => {
        fetchPets();
    }, []);

    return (
        <PetsContext.Provider value={{
            pets,
            loading,
            error,
            fetchPets,
            updatePetStatus
        }}>
            {children}
        </PetsContext.Provider>
    );
};

export const usePets = () => useContext(PetsContext);