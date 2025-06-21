import React, { useState, useEffect } from 'react';
import '../../styles/secEdit.css';
import axios from 'axios'; // jangan lupa import axios

const EditSecurityModal = ({ isOpen, onClose, securityData, onUpdateSecurity }) => {
  const [formData, setFormData] = useState({
    id: '',
    nip: '',
    nama_user: '',
    password: '',
    id_cabang: '',
    id_level: 2,
  });

  const [cabangOptions, setCabangOptions] = useState([]);

  // Fetch daftar cabang dari backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/cabang')
      .then(res => setCabangOptions(res.data))
      .catch(err => console.error('Gagal fetch cabang:', err));
  }, []);

  // Set data awal saat modal dibuka
  useEffect(() => {
    if (securityData) {
      setFormData({
        id: securityData.id,
        nip: securityData.nip,
        nama_user: securityData.name,
        password: securityData.password,
        id_cabang: securityData.id_cabang || '',
        id_level: 2,
      });
    }
  }, [securityData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSecurity(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Security</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nip">NIP:</label>
            <input
              type="number"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nama_user">Nama:</label>
            <input
              type="text"
              name="nama_user"
              value={formData.nama_user}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Biarkan kosong jika tidak diubah"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_cabang">Cabang:</label>
            <select
              name="id_cabang"
              value={formData.id_cabang}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Cabang</option>
              {cabangOptions.map((opt) => (
                <option key={opt.id_cabang} value={opt.id_cabang}>
                  {opt.nama_cabang}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Level:</label>
            <input type="text" value="Security" disabled readOnly />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Update Security</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSecurityModal;
