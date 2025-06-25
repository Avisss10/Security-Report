import React, { useState, useRef, useEffect } from 'react';
import '../../styles/post.css';
//import ConfirmModal from '../delConfirm.jsx';
//import profileImage from '../../img/profile.jpeg';

const Post = ({
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

  // Function to get color class based on nama_cabang
  const getColorClass = (namaCabang) => {
    const merah = ['Witel', 'STO Tanjung Priok'];
    const hijau = ['STO Mangga Besar', 'Pademangan', 'Mangga Dua'];
    const ungu = ['STO Cilincing', 'STO Marunda', 'Gudang Marunda'];
    const biru = ['STO Sunter', 'STO Kelapa Gading', 'Yanum Kelapa Gading'];
    const hitam = ['STO Kota', 'STO Muara Karang'];

    if (merah.some(name => namaCabang.includes(name))) return 'border-merah';
    if (hijau.some(name => namaCabang.includes(name))) return 'border-hijau';
    if (ungu.some(name => namaCabang.includes(name))) return 'border-ungu';
    if (biru.some(name => namaCabang.includes(name))) return 'border-biru';
    if (hitam.some(name => namaCabang.includes(name))) return 'border-hitam';
    return '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setIsConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`post ${getColorClass(nama_cabang)}`}>
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="#666">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="post-user-info">
            <span className='post-name'>{nama_user}</span>
            <span className='post-username'>@{nip}</span>
            <span className='post-location'>• {nama_cabang}</span>
          </div>
        </div>

        <div className="post-menu" ref={menuRef}>
          <button className="menu-button" onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <circle cx="5" cy="12" r="2"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <circle cx="19" cy="12" r="2"></circle>
            </svg>
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleDelete}>Delete Post</button>
            </div>
          )}
        </div>
      </div>

      <div className='post-content'>
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
        <span className='post-time'>{hari} • {formatJam(waktu)} • {formatTanggal(tanggal)}</span>
      </div>

      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="confirm-modal">
              <h3>Konfirmasi</h3>
              <p>Yakin ingin menghapus laporan ini?</p>
              <div className="modal-buttons">
                <button onClick={handleCancelDelete} className="cancel-btn">Batal</button>
                <button onClick={handleConfirmDelete} className="confirm-btn">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;