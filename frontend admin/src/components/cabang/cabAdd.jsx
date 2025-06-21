import React, { useState } from 'react';
import '../../styles/cabAdd.css';

const AddCabangModal = ({ isOpen, onClose, onAddCabang }) => {
  const [formData, setFormData] = useState({
    namaCabang: '',
    alamatCabang: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCabang = {
      nama_cabang: formData.namaCabang,
      alamat_cabang: formData.alamatCabang,
    };

    onAddCabang(newCabang); // kirim ke parent (CabHeader -> CabContent)
    setFormData({ namaCabang: '', alamatCabang: '' }); // reset form
    onClose(); // tutup modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Cabang</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="namaCabang">Nama Cabang:</label>
            <input
              type="text"
              id="namaCabang"
              name="namaCabang"
              value={formData.namaCabang}
              onChange={handleChange}
              required
              placeholder="Contoh: Jakarta Timur"
            />
          </div>

          <div className="form-group">
            <label htmlFor="alamatCabang">Alamat Cabang:</label>
            <textarea
              id="alamatCabang"
              name="alamatCabang"
              value={formData.alamatCabang}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Contoh: Jl. Panti, no 57 Jakarta Timur"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Cabang</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCabangModal;
