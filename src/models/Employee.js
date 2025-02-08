import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  employeeCode: String,
  name: String,
  fatherName: String,
  cnic: String,
  gender: String,
  dateOfBirth: String,
  status: String,
  address: String,
  city: String,
  remarks: { type: String },
  image: { type: String }
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;