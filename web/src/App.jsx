import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState({ patientCount: 0, doctorCount: 0, appointmentCount: 0, bedCount: 0, billingTotal: 0 });
  
  useEffect(() => {
    axios.get(`${API_URL}/dashboard`).then(res => setStats(res.data));
  }, []);

  return (
    <div className="dashboard">
      <h1>Hospital Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Patients</h3>
          <p className="stat-number">{stats.patientCount}</p>
        </div>
        <div className="stat-card">
          <h3>Doctors</h3>
          <p className="stat-number">{stats.doctorCount}</p>
        </div>
        <div className="stat-card">
          <h3>Appointments</h3>
          <p className="stat-number">{stats.appointmentCount}</p>
        </div>
        <div className="stat-card">
          <h3>Available Beds</h3>
          <p className="stat-number">{stats.bedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Bills</h3>
          <p className="stat-number">${stats.billingTotal.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', gender: '', dateOfBirth: '', phone: '', email: '', address: '', bloodType: '', emergencyContact: '', insuranceInfo: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = () => axios.get(`${API_URL}/patients`).then(res => setPatients(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/patients/${editingId}`, form);
    } else {
      await axios.post(`${API_URL}/patients`, form);
    }
    setForm({ name: '', gender: '', dateOfBirth: '', phone: '', email: '', address: '', bloodType: '', emergencyContact: '', insuranceInfo: '' });
    setEditingId(null);
    fetchPatients();
  };

  const handleEdit = (patient) => { setForm(patient); setEditingId(patient.id); };
  const handleDelete = async (id) => { await axios.delete(`${API_URL}/patients/${id}`); fetchPatients(); };

  return (
    <div className="page">
      <h1>Patient Management</h1>
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        <select value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}>
          <option value="">Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        <input placeholder="Emergency Contact" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} />
        <input placeholder="Insurance Info" value={form.insuranceInfo} onChange={e => setForm({...form, insuranceInfo: e.target.value})} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Patient</button>
      </form>
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Gender</th><th>DOB</th><th>Phone</th><th>Email</th><th>Blood</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.gender}</td><td>{p.dateOfBirth}</td><td>{p.phone}</td><td>{p.email}</td><td>{p.bloodType}</td><td>{p.status}</td>
              <td><button onClick={() => handleEdit(p)}>Edit</button><button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialty: '', department: '', phone: '', email: '', qualifications: '', experience: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = () => axios.get(`${API_URL}/doctors`).then(res => setDoctors(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/doctors/${editingId}`, form);
    } else {
      await axios.post(`${API_URL}/doctors`, form);
    }
    setForm({ name: '', specialty: '', department: '', phone: '', email: '', qualifications: '', experience: '' });
    setEditingId(null);
    fetchDoctors();
  };

  const handleEdit = (doctor) => { setForm(doctor); setEditingId(doctor.id); };
  const handleDelete = async (id) => { await axios.delete(`${API_URL}/doctors/${id}`); fetchDoctors(); };

  return (
    <div className="page">
      <h1>Doctor Management</h1>
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Specialty" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} />
        <input placeholder="Department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Qualifications" value={form.qualifications} onChange={e => setForm({...form, qualifications: e.target.value})} />
        <input type="number" placeholder="Experience (years)" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Doctor</button>
      </form>
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Specialty</th><th>Department</th><th>Phone</th><th>Email</th><th>Experience</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d.id}><td>{d.id}</td><td>{d.name}</td><td>{d.specialty}</td><td>{d.department}</td><td>{d.phone}</td><td>{d.email}</td><td>{d.experience} yrs</td><td>{d.status}</td>
              <td><button onClick={() => handleEdit(d)}>Edit</button><button onClick={() => handleDelete(d.id)} className="delete-btn">Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'Scheduled' });

  useEffect(() => {
    axios.get(`${API_URL}/appointments`).then(res => setAppointments(res.data));
    axios.get(`${API_URL}/patients`).then(res => setPatients(res.data));
    axios.get(`${API_URL}/doctors`).then(res => setDoctors(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/appointments`, form);
    setForm({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'Scheduled' });
    const res = await axios.get(`${API_URL}/appointments`);
    setAppointments(res.data);
  };

  const handleStatus = async (id, status) => {
    await axios.put(`${API_URL}/appointments/${id}`, { status });
    const res = await axios.get(`${API_URL}/appointments`);
    setAppointments(res.data);
  };

  return (
    <div className="page">
      <h1>Appointments</h1>
      <form onSubmit={handleSubmit} className="form">
        <select value={form.patientId} onChange={e => setForm({...form, patientId: parseInt(e.target.value)})} required>
          <option value="">Select Patient</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.doctorId} onChange={e => setForm({...form, doctorId: parseInt(e.target.value)})} required>
          <option value="">Select Doctor</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required />
        <input placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
        <button type="submit">Schedule Appointment</button>
      </form>
      <table className="table">
        <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}><td>{a.id}</td><td>{a.Patient?.name || '-'}</td><td>{a.Doctor?.name || '-'}</td><td>{a.date}</td><td>{a.time}</td><td>{a.reason}</td><td>{a.status}</td>
              <td>
                {a.status === 'Scheduled' && <button onClick={() => handleStatus(a.id, 'Completed')}>Complete</button>}
                {a.status === 'Scheduled' && <button onClick={() => handleStatus(a.id, 'Cancelled')}>Cancel</button>}
              </td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Beds() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ bedNumber: '', ward: '', department: '', type: 'General', status: 'Available' });

  useEffect(() => {
    axios.get(`${API_URL}/beds`).then(res => setBeds(res.data));
    axios.get(`${API_URL}/patients`).then(res => setPatients(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/beds`, form);
    setForm({ bedNumber: '', ward: '', department: '', type: 'General', status: 'Available' });
    const res = await axios.get(`${API_URL}/beds`);
    setBeds(res.data);
  };

  const handleStatus = async (id, status, patientId = null) => {
    await axios.put(`${API_URL}/beds/${id}`, { status, patientId });
    const res = await axios.get(`${API_URL}/beds`);
    setBeds(res.data);
  };

  return (
    <div className="page">
      <h1>Bed Management</h1>
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Bed Number" value={form.bedNumber} onChange={e => setForm({...form, bedNumber: e.target.value})} required />
        <input placeholder="Ward" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} />
        <input placeholder="Department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="General">General</option>
          <option value="ICU">ICU</option>
          <option value="Private">Private</option>
          <option value="Ward">Ward</option>
        </select>
        <button type="submit">Add Bed</button>
      </form>
      <div className="beds-grid">
        {beds.map(bed => (
          <div key={bed.id} className={`bed-card ${bed.status.toLowerCase()}`}>
            <h3>Bed {bed.bedNumber}</h3>
            <p>Ward: {bed.ward}</p>
            <p>Type: {bed.type}</p>
            <p>Status: {bed.status}</p>
            {bed.status === 'Available' && (
              <select onChange={(e) => {
                const pid = e.target.value ? parseInt(e.target.value) : null;
                handleStatus(bed.id, pid ? 'Occupied' : 'Available', pid);
              }}>
                <option value="">Assign Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
            {bed.status === 'Occupied' && (
              <button onClick={() => handleStatus(bed.id, 'Available', null)}>Release</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Billing() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', description: '', amount: '', status: 'Pending' });

  useEffect(() => {
    axios.get(`${API_URL}/billing`).then(res => setBills(res.data));
    axios.get(`${API_URL}/patients`).then(res => setPatients(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/billing`, { ...form, amount: parseFloat(form.amount) });
    setForm({ patientId: '', description: '', amount: '', status: 'Pending' });
    const res = await axios.get(`${API_URL}/billing`);
    setBills(res.data);
  };

  const handleStatus = async (id, status) => {
    await axios.put(`${API_URL}/billing/${id}`, { status });
    const res = await axios.get(`${API_URL}/billing`);
    setBills(res.data);
  };

  const totalPending = bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="page">
      <h1>Billing & Finance</h1>
      <div className="billing-stats">
        <div className="stat-card"><h3>Pending</h3><p>${totalPending.toLocaleString()}</p></div>
        <div className="stat-card"><h3>Paid</h3><p>${totalPaid.toLocaleString()}</p></div>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <select value={form.patientId} onChange={e => setForm({...form, patientId: parseInt(e.target.value)})} required>
          <option value="">Select Patient</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
        <button type="submit">Create Bill</button>
      </form>
      <table className="table">
        <thead><tr><th>ID</th><th>Patient</th><th>Description</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {bills.map(b => (
            <tr key={b.id}><td>{b.id}</td><td>{b.Patient?.name || '-'}</td><td>{b.description}</td><td>${b.amount.toLocaleString()}</td><td>{b.status}</td>
              <td>{b.status === 'Pending' && <button onClick={() => handleStatus(b.id, 'Paid')}>Mark Paid</button>}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', diagnosis: '', prescription: '', notes: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    axios.get(`${API_URL}/medical-records`).then(res => setRecords(res.data));
    axios.get(`${API_URL}/patients`).then(res => setPatients(res.data));
    axios.get(`${API_URL}/doctors`).then(res => setDoctors(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/medical-records`, form);
    setForm({ patientId: '', doctorId: '', diagnosis: '', prescription: '', notes: '', date: new Date().toISOString().split('T')[0] });
    const res = await axios.get(`${API_URL}/medical-records`);
    setRecords(res.data);
  };

  return (
    <div className="page">
      <h1>Medical Records</h1>
      <form onSubmit={handleSubmit} className="form">
        <select value={form.patientId} onChange={e => setForm({...form, patientId: parseInt(e.target.value)})} required>
          <option value="">Select Patient</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.doctorId} onChange={e => setForm({...form, doctorId: parseInt(e.target.value)})} required>
          <option value="">Select Doctor</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        <input placeholder="Diagnosis" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} />
        <textarea placeholder="Prescription" value={form.prescription} onChange={e => setForm({...form, prescription: e.target.value})} />
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        <button type="submit">Add Record</button>
      </form>
      <div className="records-list">
        {records.map(r => (
          <div key={r.id} className="record-card">
            <h3>Record #{r.id}</h3>
            <p><strong>Patient:</strong> {r.Patient?.name}</p>
            <p><strong>Doctor:</strong> {r.Doctor?.name}</p>
            <p><strong>Date:</strong> {r.date}</p>
            <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
            <p><strong>Prescription:</strong> {r.prescription}</p>
            <p><strong>Notes:</strong> {r.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/patients', label: 'Patients' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/beds', label: 'Beds' },
    { path: '/billing', label: 'Billing' },
    { path: '/records', label: 'Medical Records' },
  ];
  return (
    <nav className="sidebar">
      <h2>🏥 Hospital</h2>
      {links.map(link => (
        <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'active' : ''}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/beds" element={<Beds />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/records" element={<MedicalRecords />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
