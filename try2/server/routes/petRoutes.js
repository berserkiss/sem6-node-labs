const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const AdoptionForm = require("../models/AdoptionForm");
const requireAuth = require("../middleware/requireAuth");

// Get all available pets
router.get("/", async (req, res) => {
    try {
        const pets = await Pet.find({ status: "available" });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single pet details
router.get("/:id", async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ error: "Pet not found" });
        }
        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:id/adopt", requireAuth, async (req, res) => {
    try {
        const { livingSituation, phoneNumber, previousExperience, familyComposition } = req.body;
        const petId = req.params.id;
        const userId = req.userId;

        // Проверка обязательных полей
        if (!livingSituation || !phoneNumber || !previousExperience || !familyComposition) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Проверка существования животного
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: "Animal is not found" });
        }

        // Проверка, не подавал ли пользователь уже заявку на это животное
        const existingApplication = await AdoptionForm.findOne({
            pet: petId,
            user: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                error: "You have already submitted an application for this pet",
                applicationId: existingApplication._id
            });
        }

        // Создание заявки
        const adoptionForm = new AdoptionForm({
            pet: petId,
            user: userId,
            livingSituation,
            phoneNumber,
            previousExperience,
            familyComposition
        });

        await adoptionForm.save();

        res.status(201).json({
            message: "Request has been made",
            application: adoptionForm,
            petStatus: pet.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/check-application', requireAuth, async (req, res) => {
    try {
        const application = await AdoptionForm.findOne({
            pet: req.params.id,
            user: req.userId
        });

        if (application) {
            return res.json({
                hasApplication: true,
                applicationId: application._id,
                status: application.status
            });
        }

        res.json({ hasApplication: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;