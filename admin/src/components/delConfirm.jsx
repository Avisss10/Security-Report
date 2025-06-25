import React from 'react';
import '../styles/delConfirm.css';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button className="btn-cancel" onClick={onCancel}>Batal</button>
          <button className="btn-delete" onClick={onConfirm}>Hapus</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
