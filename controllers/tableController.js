exports.getIndex = (req, res) => {
  res.render("index");
};

exports.getDoctors = (req, res) => {
  res.render("categories/doctors");
};

exports.getPatients = (req, res) => {
  res.render("categories/patients");
};
exports.getPharmaceuticalCompanies = (req, res) => {
  res.render("categories/pharmaceutical-companies");
};
exports.getDrugs = (req, res) => {
  res.render("categories/drugs");
};
exports.getPharmacies = (req, res) => {
  res.render("categories/pharmacies");
};
exports.getPrescriptions = (req, res) => {
  res.render("categories/prescriptions");
};
exports.getPharmacyDrugs = (req, res) => {
  res.render("categories/pharmacy-drugs");
};
exports.getPharmacyContracts = (req, res) => {
  res.render("categories/pharmacy-contracts");
};


