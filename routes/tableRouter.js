const express = require("express");
const tableRouter = express.Router();
const { getConnection } = require('../db/oracle');

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

tableRouter.post("/doctors", tableController.postHandleDoctor);
tableRouter.post("/patients", tableController.postHandlePatient);
tableRouter.post("/pharmaceutical-companies", tableController.postHandlePharmaceuticalCompany);
tableRouter.post("/pharmacies",tableController.postHandlePharmacies);
tableRouter.post("/drugs", tableController.postHandleDrugs);
tableRouter.post("/prescriptions", tableController.postHandlePrescriptions);
tableRouter.post("/pharmacy-contracts", tableController.postHandlePharmacyContracts);
tableRouter.post("/pharmacy-drugs", tableController.postHandlePharmacyDrugs);

module.exports = tableRouter;