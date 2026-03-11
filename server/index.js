const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './hospital.db',
  logging: false
});

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.DATEONLY },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  bloodType: { type: DataTypes.STRING },
  emergencyContact: { type: DataTypes.STRING },
  insuranceInfo: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  specialty: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  qualifications: { type: DataTypes.TEXT },
  experience: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

const Appointment = sequelize.define('Appointment', {
  patientId: { type: DataTypes.INTEGER },
  doctorId: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY },
  time: { type: DataTypes.STRING },
  reason: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Scheduled' }
});

const Bed = sequelize.define('Bed', {
  bedNumber: { type: DataTypes.STRING, allowNull: false },
  ward: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Available' },
  patientId: { type: DataTypes.INTEGER }
});

const MedicalRecord = sequelize.define('MedicalRecord', {
  patientId: { type: DataTypes.INTEGER },
  doctorId: { type: DataTypes.INTEGER },
  diagnosis: { type: DataTypes.TEXT },
  prescription: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATEONLY }
});

const Billing = sequelize.define('Billing', {
  patientId: { type: DataTypes.INTEGER },
  description: { type: DataTypes.TEXT },
  amount: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  dueDate: { type: DataTypes.DATEONLY }
});

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Patient.hasMany(Bed, { foreignKey: 'patientId' });
Patient.hasMany(MedicalRecord, { foreignKey: 'patientId' });
Doctor.hasMany(MedicalRecord, { foreignKey: 'doctorId' });
Patient.hasMany(Billing, { foreignKey: 'patientId' });

app.get('/api/patients', async (req, res) => {
  const patients = await Patient.findAll();
  res.json(patients);
});

app.post('/api/patients', async (req, res) => {
  const patient = await Patient.create(req.body);
  res.json(patient);
});

app.get('/api/patients/:id', async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  res.json(patient);
});

app.put('/api/patients/:id', async (req, res) => {
  await Patient.update(req.body, { where: { id: req.params.id } });
  const patient = await Patient.findByPk(req.params.id);
  res.json(patient);
});

app.delete('/api/patients/:id', async (req, res) => {
  await Patient.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Patient deleted' });
});

app.get('/api/doctors', async (req, res) => {
  const doctors = await Doctor.findAll();
  res.json(doctors);
});

app.post('/api/doctors', async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.json(doctor);
});

app.get('/api/doctors/:id', async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  res.json(doctor);
});

app.put('/api/doctors/:id', async (req, res) => {
  await Doctor.update(req.body, { where: { id: req.params.id } });
  const doctor = await Doctor.findByPk(req.params.id);
  res.json(doctor);
});

app.delete('/api/doctors/:id', async (req, res) => {
  await Doctor.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Doctor deleted' });
});

app.get('/api/appointments', async (req, res) => {
  const appointments = await Appointment.findAll({ include: [Patient, Doctor] });
  res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
  const appointment = await Appointment.create(req.body);
  res.json(appointment);
});

app.put('/api/appointments/:id', async (req, res) => {
  await Appointment.update(req.body, { where: { id: req.params.id } });
  const appointment = await Appointment.findByPk(req.params.id);
  res.json(appointment);
});

app.delete('/api/appointments/:id', async (req, res) => {
  await Appointment.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Appointment deleted' });
});

app.get('/api/beds', async (req, res) => {
  const beds = await Bed.findAll({ include: [Patient] });
  res.json(beds);
});

app.post('/api/beds', async (req, res) => {
  const bed = await Bed.create(req.body);
  res.json(bed);
});

app.put('/api/beds/:id', async (req, res) => {
  await Bed.update(req.body, { where: { id: req.params.id } });
  const bed = await Bed.findByPk(req.params.id);
  res.json(bed);
});

app.delete('/api/beds/:id', async (req, res) => {
  await Bed.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Bed deleted' });
});

app.get('/api/medical-records', async (req, res) => {
  const records = await MedicalRecord.findAll({ include: [Patient, Doctor] });
  res.json(records);
});

app.post('/api/medical-records', async (req, res) => {
  const record = await MedicalRecord.create(req.body);
  res.json(record);
});

app.get('/api/medical-records/:patientId', async (req, res) => {
  const records = await MedicalRecord.findAll({ 
    where: { patientId: req.params.patientId },
    include: [Doctor]
  });
  res.json(records);
});

app.get('/api/billing', async (req, res) => {
  const bills = await Billing.findAll({ include: [Patient] });
  res.json(bills);
});

app.post('/api/billing', async (req, res) => {
  const bill = await Billing.create(req.body);
  res.json(bill);
});

app.put('/api/billing/:id', async (req, res) => {
  await Billing.update(req.body, { where: { id: req.params.id } });
  const bill = await Billing.findByPk(req.params.id);
  res.json(bill);
});

app.get('/api/dashboard', async (req, res) => {
  const patientCount = await Patient.count();
  const doctorCount = await Doctor.count();
  const appointmentCount = await Appointment.count();
  const bedCount = await Bed.count({ where: { status: 'Available' } });
  const billingTotal = await Billing.sum('amount', { where: { status: 'Pending' } });
  res.json({ patientCount, doctorCount, appointmentCount, bedCount, billingTotal: billingTotal || 0 });
});

const PORT = 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
