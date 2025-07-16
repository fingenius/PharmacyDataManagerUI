const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const PharmaceuticalCompany = require("../models/pharmaceutical-company");
const Pharmacy = require("../models/pharmacy");
const Drug = require("../models/drug");
const Prescription = require("../models/prescription");
const PharmacyContract = require("../models/pharmacy-contract");
const PharmacyDrugs = require("../models/pharmacy-drug");
exports.getIndex = (req, res) => {
  res.render("index");
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.fetchAll();
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/doctors", {
      pageTitle: "Doctors",
      doctors,
      toast : toast || null
    });
  } catch (err) {
    console.error("Fetch doctors failed:", err);
    res.status(500).send("Could not retrieve doctors");
  }
};

exports.postHandleDoctor = async (req, res) => {
  const action = req.body.action;
  if(action === "add"){
    const { DAID, DNAME, SPECIALITY, YEARS_OF_EXPERIENCE } = req.body;
    const newDoctor = new Doctor(DAID, DNAME, SPECIALITY, YEARS_OF_EXPERIENCE);
    try {
      const message = await newDoctor.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/doctors")
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  }
  else if(action === "delete"){
    const { DAID } = req.body;
    try {
      const message = await Doctor.deleteById(DAID);
      req.session.toast = { type: "success", message };
      res.redirect("/doctors");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if(action === "update"){
    const { DAID, DNAME, SPECIALITY, YEARS_OF_EXPERIENCE } = req.body;
    try {
      const message = await Doctor.updateById(DAID, DNAME, SPECIALITY, YEARS_OF_EXPERIENCE);
      req.session.toast = { type: "success", message };
      res.redirect("/doctors");
    } catch (error) {
      console.error("Error updating doctor:", error);
      res.status(500).send("Database error: " + error.message);
    }
  }
  else{
    res.status(400).send("Invalid action");
  }
};


exports.getPatients = async (req, res) => {
  const doctorID = req.query.doctorID;
  try{
    let patients;
    if(doctorID){
      patients = await Patient.fetchByDoctorId(doctorID);
    }else{
      patients = await Patient.fetchAll();
    }
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/patients", {
      pageTitle: "Patients",
      patients,
      doctorID,
      toast : toast || null
    });
  }catch(err){
    console.error("Error fetching patients:", err);
    res.status(500).send("Could not retrieve patients");
  }
};

exports.postHandlePatient = async (req, res) => {
  const action = req.body.action;
  if(action === "add"){
    const { PAID, PNAME, PADDRESS, PAGE, PRIMARY_PHYSICIAN } = req.body;
    const newPatient = new Patient(PAID, PNAME, PADDRESS, PAGE, PRIMARY_PHYSICIAN);
    try {
      const message = await newPatient.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/patients");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  }
  else if(action === "delete"){
    const { PAID } = req.body;
    try {
      const message = await Patient.deleteById(PAID);
      req.session.toast = { type: "success", message };
      res.redirect("/patients");
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if(action === "update"){
    const { PAID, PNAME, PADDRESS, PAGE, PRIMARY_PHYSICIAN } = req.body;
    try {
      const message = await Patient.updateById(PAID, PNAME, PADDRESS, PAGE, PRIMARY_PHYSICIAN);
      req.session.toast = { type: "success", message };
      res.redirect("/patients");
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(500).send("Database error: " + error.message);
    }
  }
  else{
    res.status(400).send("Invalid action");
  }
};

exports.getPharmaceuticalCompanies = async (req, res) => {
  try{
    const pharmaceuticalCompanies = await PharmaceuticalCompany.fetchAll();
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/pharmaceutical-companies", {
      pageTitle: "Pharmaceutical Companies",
      pharmaceuticalCompanies,
      toast: toast || null
    });
  }catch(err){
    console.error("Error fetching pharmaceutical companies:", err);
    res.status(500).send("Could not retrieve pharmaceutical companies");
  }
};
exports.postHandlePharmaceuticalCompany = async (req, res) => {
  const action = req.body.action;
  if(action === "add"){
    const { PHCNAME, PHCPHONE } = req.body;
    const newCompany = new PharmaceuticalCompany(PHCNAME, PHCPHONE);
    try {
      const message = await newCompany.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/pharmaceutical-companies");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  }
  else if(action === "delete"){
    const { PHCNAME } = req.body;
    try {
      const message = await PharmaceuticalCompany.deleteByName(PHCNAME);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmaceutical-companies");
    } catch (error) {
      console.error("Error deleting pharmaceutical company:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if(action === "update"){
    const { PHCNAME, PHCPHONE } = req.body;
    try {
      const message = await PharmaceuticalCompany.updateByName(PHCNAME, PHCPHONE);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmaceutical-companies");
    } catch (error) {
      console.error("Error updating pharmaceutical company:", error);
      res.status(500).send("Database error: " + error.message);
    }
  }
  else{
    res.status(400).send("Invalid action");
  }
};

exports.getPharmacies = async (req, res) => {
  try{
    const pharmacies = await Pharmacy.fetchAll();
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/pharmacies", {
      pageTitle: "Pharmacies",
      pharmacies,
      toast: toast || null
    });
  }catch(err){
    console.error("Error fetching pharmacies:", err);
    res.status(500).send("Could not retrieve pharmacies");
  }
};

exports.postHandlePharmacies = async (req, res) => {
  const action = req.body.action;
  if(action === "add"){
    const { PHNAME, PHADDRESS, PHPHONE } = req.body;
    const newPharmacy = new Pharmacy(PHNAME, PHADDRESS, PHPHONE);
    try {
      const message = await newPharmacy.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacies");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  }
  else if(action === "delete"){
    const { PHNAME , PHADDRESS } = req.body;
    try {
      const message = await Pharmacy.deleteByNameAddress(PHNAME,PHADDRESS);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacies");
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if(action === "update"){
    const { PHNAME, PHADDRESS, PHPHONE } = req.body;
    try {
      const message = await Pharmacy.updateByNameAddress(PHNAME, PHADDRESS, PHPHONE);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacies");
    } catch (error) {
      console.error("Error updating pharmacy:", error);
      res.status(500).send("Database error: " + error.message);
    }
  }
  else{
    res.status(400).send("Invalid action");
  }
};

exports.getDrugs = async (req, res) => {
  const PHARMACEUTICAL_COMPANY_NAME = req.query.company;
  try {
    let drugs; 
    if(PHARMACEUTICAL_COMPANY_NAME){
      drugs = await Drug.fetchByCompany(PHARMACEUTICAL_COMPANY_NAME);
    }
    else{
      drugs = await Drug.fetchAll();
    }
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/drugs", {
      pageTitle: "Drugs",
      drugs,
      PHARMACEUTICAL_COMPANY_NAME,
      toast: toast || null
    });
  } catch (err) {
    console.error("Error fetching drugs:", err);
    res.status(500).send("Could not retrieve drugs");
  }
};

exports.postHandleDrugs = async (req,res)=>{
  const action = req.body.action;
  if(action === "add"){
    const { PHCOMPANY, TRADE_NAME, FORMULA } = req.body;
    const newDrug = new Drug(PHCOMPANY, TRADE_NAME, FORMULA);
    try {
      const message = await newDrug.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/drugs");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  }
  else if(action === "delete"){
    const { PHCOMPANY, TRADE_NAME } = req.body;
    try {
      const message = await Drug.deleteByCompanyTrade(PHCOMPANY, TRADE_NAME);
      req.session.toast = { type: "success", message };
      res.redirect("/drugs");
    } catch (error) {
      console.error("Error deleting drug:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if(action === "update"){
    const { PHCOMPANY, TRADE_NAME, FORMULA } = req.body;
    try {
      const message = await Drug.updateByCompanyTrade(PHCOMPANY, TRADE_NAME, FORMULA);
      req.session.toast = { type: "success", message };
      res.redirect("/drugs");
    } catch (error) {
      console.error("Error updating drug:", error);
      res.status(500).send("Database error: " + error.message);
    }
  }
  else{
    res.status(400).send("Invalid action");
  }
};

exports.getPrescriptions = async(req, res) => {
  const {patient_id , prescription_start_date, prescription_end_date} = req.query;
  try {
    let prescriptions;
    if(patient_id && prescription_start_date && prescription_end_date){
      prescriptions = await Prescription.fetchByPatientIDPrescDate(patient_id, prescription_start_date, prescription_end_date);
    } else {
      prescriptions = await Prescription.fetchAll();
    }
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/prescriptions", {
      pageTitle: "Prescriptions",
      prescriptions,
      patient_id: patient_id || null,
      prescription_start_date: prescription_start_date || null,
      prescription_end_date: prescription_end_date || null,
      toast: toast || null
    });
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).send("Could not retrieve prescriptions");
  }
};

exports.postHandlePrescriptions = async(req,res)=>{
  const action = req.body.action;
  if(action === "add"){
    const { DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME, PRESCRIPTION_DATE, QUANTITY} = req.body;
    const newPrescription = new Prescription(DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME, PRESCRIPTION_DATE, QUANTITY);
    try {
      const message = await newPrescription.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/prescriptions");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  }
  else if(action === "delete"){
    const { DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME } = req.body;
    try {
      const message = await Prescription.deletePrescription(DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME);
      req.session.toast = { type: "success", message };
      res.redirect("/prescriptions");
    } catch (error) {
      console.error("Error deleting drug:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if(action === "update"){
    const { DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME, PRESCRIPTION_DATE, QUANTITY } = req.body;
    try {
      const message = await Drug.updatePrescription(DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME, PRESCRIPTION_DATE, QUANTITY);
      req.session.toast = { type: "success", message };
      res.redirect("/prescriptions");
    } catch (error) {
      console.error("Error updating drug:", error);
      res.status(500).send("Database error: " + error.message);
    }
  }
  else{
    res.status(400).send("Invalid action");
  }
};

exports.getPharmacyDrugs = async(req, res) => {
  const {pharmacy_name, pharmacy_address} = req.query;
  try{
    let pharmacy_Drugs;
    if(pharmacy_name && pharmacy_address){
      pharmacy_Drugs = await PharmacyDrugs.fetchByNameAddress(pharmacy_name, pharmacy_address);
    } else {
      pharmacy_Drugs = await PharmacyDrugs.fetchAll();
    }
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/pharmacy-drugs",{
      pageTitle: "Pharmacy Drugs",
      pharmacy_Drugs,
      pharmacy_name: pharmacy_name || null, 
      pharmacy_address: pharmacy_address || null,
      toast: toast || null
    });
  }catch(err){
    console.error("Error fetching pharmacy Drugs:", err);
    res.status(500).send("Could not retrieve pharmacy Drugs");
  }
};

exports.postHandlePharmacyDrugs = async (req, res) => {
  const action = req.body.action;
  if (action === "add") {
    const { PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME, PRICE } = req.body;
    const newPharmacyDrug = new PharmacyDrugs(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME, PRICE);
    try {
      const message = await newPharmacyDrug.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacy-drugs");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  } else if (action === "delete") {
    const { PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME } = req.body;
    try {
      const message = await PharmacyDrugs.deletePharmacyDrug(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacy-drugs");
    } catch (error) {
      console.error("Error deleting pharmacy drug:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if (action === "update") {
    const { PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME, PRICE } = req.body;
    try {
      const message = await PharmacyDrugs.updatePharmacyDrug(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME, PRICE);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacy-drugs");
    } catch (error) {
      console.error("Error updating pharmacy drug:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else {
    res.status(400).send("Invalid action");
  }
};

exports.getPharmacyContracts = async (req, res) => {
  const { pharmacy_name, pharmacy_address, pharmaceutical_company_name } = req.query;
  try{
    let pharmacy_Contracts;
    if(pharmacy_name && pharmacy_address && pharmaceutical_company_name){
      pharmacy_Contracts = await PharmacyContract.fetchByDetails(pharmacy_name, pharmacy_address, pharmaceutical_company_name);
    } else {
      pharmacy_Contracts = await PharmacyContract.fetchAll();
    }
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("categories/pharmacy-contracts", {
      pageTitle: "Pharmacy Contracts",
      pharmacy_Contracts,
      pharmacy_name: pharmacy_name || null,
      pharmacy_address: pharmacy_address || null,
      pharmaceutical_company_name: pharmaceutical_company_name || null,
      toast: toast || null
    });
  }catch(err){
    console.error("Error fetching pharmacy contracts:", err);
    res.status(500).send("Could not retrieve pharmacy contracts");
  }
};

exports.postHandlePharmacyContracts = async (req, res) => {
  const action = req.body.action;
  if (action === "add") {
    const { PHANAME, PHA_ADDRESS, PHARMA_COMPANY, START_DATE, END_DATE, CONTENT, SUPERVISOR } = req.body;
    const newContract = new PharmacyContract(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, START_DATE, END_DATE, CONTENT, SUPERVISOR);
    try {
      const message = await newContract.saveViaProcedure();
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacy-contracts");
    } catch (error) {
      res.status(500).send("Database error: " + error.message);
    }
  } else if (action === "delete") {
    const { PHANAME, PHA_ADDRESS, PHARMA_COMPANY } = req.body;
    try {
      const message = await PharmacyContract.deletePharmacyContract(PHANAME, PHA_ADDRESS, PHARMA_COMPANY);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacy-contracts");
    } catch (error) {
      console.error("Error deleting pharmacy contract:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else if (action === "update") {
    const { PHANAME, PHA_ADDRESS, PHARMA_COMPANY, START_DATE, END_DATE, CONTENT, SUPERVISOR } = req.body;
    try {
      const message = await PharmacyContract.updatePharmacyContract(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, START_DATE, END_DATE, CONTENT, SUPERVISOR);
      req.session.toast = { type: "success", message };
      res.redirect("/pharmacy-contracts");
    } catch (error) {
      console.error("Error updating pharmacy contract:", error);
      res.status(500).send("Database error: " + error.message);
    }
  } else {
    res.status(400).send("Invalid action");
  }
};


