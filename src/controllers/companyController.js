import Company from "../models/Company.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCompany = async (req, res) => {
  const {
    companyName,
    shortName,
    code,
    phoneNumber,
    email,
    address,
    status,
    remarks,
  } = req.body;

  const newCompany = new Company({
    companyName,
    shortName,
    code,
    phoneNumber,
    email,
    address,
    status,
    remarks,
  });

  try {
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    res.json(company);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  const {
    companyName,
    shortName,
    code,
    phoneNumber,
    email,
    address,
    status,
    remarks,
  } = req.body;

  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        shortName,
        code,
        phoneNumber,
        email,
        address,
        status,
        remarks,
      },
      { new: true }
    );
    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    res.json(deletedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};