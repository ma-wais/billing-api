import Employee from "../models/Employee.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  const {
    employeeCode,
    employeeName,
    cnic,
    fatherName,
    gender,
    dateOfBirth,
    status,
    address,
    city,
    remarks,
  } = req.body;

  const image = req.file?.path;
  if (!image) {
    return res.status(400).json({ message: 'Image upload failed' });
  }

  const newEmployee = new Employee({
    code: employeeCode,
    name: employeeName,
    fatherName,
    cnic,
    gender,
    dateOfBirth,
    status,
    address,
    city,
    remarks,
    image,
  });

  try {
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.json(employee);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    console.log(req.body);
    const {
      employeeCode,
      employeeName,
      cnic,
      fatherName,
      gender,
      dateOfBirth,
      status,
      address,
      city,
      remarks,
    } = req.body;

    const updateData = {
      employeeCode,
      name: employeeName,
      fatherName,
      cnic,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : employee.dateOfBirth,
      status,
      address,
      city,
      remarks,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};