// Dépendances nécessaires
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/job-tracker")
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Modèle Company
const companySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  poste: {
    type: String,
    required: true,
  },
  ville: {
    type: String,
    required: true,
  },
  departement: {
    type: String,
    required: true,
  },
  pays: {
    type: String,
    required: true,
  },
  etat: {
    type: String,
    required: true,
    enum: ["en attente", "contacté", "refusé", "accepté"], // Vous pouvez ajuster les états possibles
    default: "en attente",
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", companySchema);

// Routes
// GET - Récupérer toutes les entreprises
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Créer une nouvelle entreprise
app.post("/api/companies", async (req, res) => {
  const company = new Company(req.body);
  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Mettre à jour une entreprise
app.put("/api/companies/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une entreprise
app.delete("/api/companies/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Entreprise supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
