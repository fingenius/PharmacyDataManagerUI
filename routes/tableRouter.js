const express = require("express");
const tableRouter = express.Router();

const tableController = require("../controllers/tableController");

tableRouter.get("/", tableController.getIndex);
tableRouter.get("/doctors", tableController.getDoctors);
tableRouter.get("/patients", tableController.getPatients);
tableRouter.get("/pharmaceutical-companies", tableController.getPharmaceuticalCompanies);
tableRouter.get("/drugs", tableController.getDrugs);
tableRouter.get("/pharmacies", tableController.getPharmacies);
tableRouter.get("/prescriptions", tableController.getPrescriptions);
tableRouter.get("/pharmacy-drugs", tableController.getPharmacyDrugs);
tableRouter.get("/pharmacy-contracts", tableController.getPharmacyContracts);

module.exports = tableRouter;