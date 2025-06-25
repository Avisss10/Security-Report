import React from 'react';
import '../../styles/detailModal.css';
import profileImage from '../../img/profile.jpeg';

const DetailModal = ({ isOpen, laporan, onClose }) => {
  if (!isOpen || !laporan) return null;

  const formatTanggal = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatJam = (jamString) => {
    if (!jamString) return '-';
    const [hour, minute] = jamString.split(':');
    return `${hour}:${minute} WIB`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detail Laporan</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* User Info */}
          <div className="user-section">
            <div className="user-info">
              <img src={profileImage} alt="Profile" className="user-avatar" />
              <div className="user-details">
                <h3>{laporan.nama_user}</h3>
                <p className="user-meta">NIP: {laporan.nip}</p>
                <p className="user-meta">Cabang: {laporan.nama_cabang}</p>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="report-section">
            <div className="detail-grid">
              <div className="detail-item">
                <label>ID Laporan</label>
                <span>{laporan.id_laporan}</span>
              </div>
              <div className="detail-item">
                <label>Jenis Laporan</label>
                <span className={`jenis-badge ${laporan.jenis_laporan?.toLowerCase()}`}>
                  {laporan.jenis_laporan}
                </span>
              </div>
              <div className="detail-item">
                <label>Judul</label>
                <span>{laporan.judul_laporan}</span>
              </div>
              <div className="detail-item">
                <label>Cuaca</label>
                <span className={`cuaca-badge ${laporan.kondisi_cuaca?.toLowerCase()}`}>
                  {laporan.kondisi_cuaca}
                </span>
              </div>
              <div className="detail-item">
                <label>Tanggal</label>
                <span>{formatTanggal(laporan.tanggal_laporan)}</span>
              </div>
              <div className="detail-item">
                <label>Waktu</label>
                <span>{formatJam(laporan.waktu_laporan)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <label>Deskripsi</label>
          <div className="description-content">
              {laporan.deskripsi_laporan || 'Tidak ada deskripsi'}
            </div>
          </div>

          {/* Photos */}
          {laporan.foto_list && laporan.foto_list.length > 0 && (
            <div className="photos-section">
              <label>Foto Laporan ({laporan.foto_list.length})</label>
              <div className="photos-grid">
                {laporan.foto_list.map((foto, index) => (
                  <div key={index} className="photo-item">
                    <img
                      src={`http://localhost:5000/uploads/${foto}`}
                      alt={`Foto ${index + 1}`}
                      onClick={() => window.open(`http://localhost:5000/uploads/${foto}`, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-modal-btn" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;