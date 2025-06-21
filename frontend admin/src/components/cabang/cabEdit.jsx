import React, { useState, useEffect } from 'react';
import '../../styles/cabEdit.css';

const EditCabangModal = ({ isOpen, onClose, cabangData, onUpdateCabang }) => {
  const [formData, setFormData] = useState({
    id: '',
    namaCabang: '',
    alamatCabang: '',
  });

  useEffect(() => {
    if (cabangData) {
      setFormData({
        id: cabangData.id,
        namaCabang: cabangData.namaCabang,
        alamatCabang: cabangData.alamatCabang,
      });
    }
  }, [cabangData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ubah ke format yang backend butuh
    const payload = {
      id: formData.id,
      namaCabang: formData.namaCabang,
      alamatCabang: formData.alamatCabang,
    };

    onUpdateCabang(payload); // dikirim ke CabContent
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Cabang</h2>
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
            <button type="submit" className="submit-btn">Update Cabang</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCabangModal;
