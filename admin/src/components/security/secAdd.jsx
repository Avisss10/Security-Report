import React, { useState, useEffect } from 'react';
import '../../styles/secAdd.css';
import axios from 'axios';

const AddSecurityModal = ({ isOpen, onClose, onAddSecurity }) => {
  const [formData, setFormData] = useState({
    nip: '',
    nama_user: '',
    password: '',
    id_cabang: '',
    id_level: 2,
  });

  const [cabangOptions, setCabangOptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get('http://localhost:5000/api/cabang')
        .then((res) => setCabangOptions(res.data))
        .catch((err) => console.error('Gagal fetch cabang:', err));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddSecurity(formData);
      setFormData({
        nip: '',
        nama_user: '',
        password: '',
        id_cabang: '',
        id_level: 2,
      });
      onClose();
    } catch (error) {
      console.error('Gagal menambahkan security:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tambah Security</h2>
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
            <input type="text" value="Security" readOnly disabled />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="submit-btn">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSecurityModal;
