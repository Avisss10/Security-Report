import React, { useState, useRef, useEffect } from 'react';
import '../../styles/post.css';
import ConfirmModal from '../delConfirm.jsx';
import profileImage from '../../img/profile.jpeg';
import { toast } from 'react-toastify';

const ArcPost = ({
  id_laporan,
  nama_user,
  nip,
  nama_cabang,
  deskripsi,
  jenis,
  judul,
  cuaca,
  hari,
  tanggal,
  waktu,
  foto_list,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleDelete = () => {
    setIsConfirmOpen(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(id_laporan);
    toast.success('Laporan berhasil dihapus');
    setIsConfirmOpen(false);
  };

  const handleCancelDelete = () => setIsConfirmOpen(false);

  const formatTanggal = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('id-ID');
  };

  const formatJam = (jamString) => {
    const [hour, minute] = jamString.split(':');
    return `${hour}:${minute} WIB`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-user">
          <img src={profileImage} alt="Profile" className="post-avatar" />
          <div className="post-user-info">
            <span className="post-name">{nama_user}</span>
            <span className="post-username">· {nip}</span>
            <span className="post-location">· {nama_cabang}</span>
          </div>
        </div>

        <div className="post-menu" ref={menuRef}>
          <button className="menu-button" onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleDelete}>Delete Post</button>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        {foto_list && foto_list.length > 0 && (
          <div className="post-image-grid">
            {foto_list.map((foto, index) => (
              <img
                key={index}
                src={`http://localhost:5000/uploads/${foto}`}
                alt={`Foto ${index + 1}`}
                className="post-image"
                onClick={() => window.open(`http://localhost:5000/uploads/${foto}`, '_blank')}
              />
            ))}
          </div>
        )}
        <div className="post-divider">··········</div>
        <p><strong>Jenis:</strong> {jenis}</p>
        <p><strong>Judul:</strong> {judul}</p>
        <p><strong>Cuaca:</strong> {cuaca}</p>
        <div className="post-divider">··········</div>
        <p className="post-description">{deskripsi}</p>
      </div>

      <div className="post-footer">
        <span className="post-time">
          {hari} · {formatJam(waktu)} · {formatTanggal(tanggal)}
        </span>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Yakin ingin menghapus laporan ini?"
      />
    </div>
  );
};

export default ArcPost;
