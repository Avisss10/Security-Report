import React, { useState } from 'react';
import '../../styles/arcTable.css';
import DetailModal from './DetailModal';

const ArchiveTable = ({ laporan, onDelete }) => {
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const formatTanggal = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('id-ID');
  };

  const formatJam = (jamString) => {
    if (!jamString) return '-';
    const [hour, minute] = jamString.split(':');
    return `${hour}:${minute} WIB`;
  };

  const handleDetailClick = (laporan) => {
    setSelectedLaporan(laporan);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedLaporan(null);
  };

  return (
    <div className="archive-table-container">
      <div className="table-wrapper">
        <table className="archive-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NIP</th>
              <th>Nama</th>
              <th>Jenis Laporan</th>
              <th>Judul</th>
              <th>Cabang</th>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Cuaca</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {laporan.length > 0 ? (
              laporan.map((item) => (
                <tr key={item.id_laporan}>
                  <td>{item.id_laporan}</td>
                  <td>{item.nip}</td>
                  <td>{item.nama_user}</td>
                  <td>
                    <span className={`jenis-badge ${item.jenis_laporan?.toLowerCase()}`}>
                      {item.jenis_laporan}
                    </span>
                  </td>
                  <td className="judul-cell">{item.judul_laporan}</td>
                  <td>{item.nama_cabang}</td>
                  <td>{formatTanggal(item.tanggal_laporan)}</td>
                  <td>{formatJam(item.waktu_laporan)}</td>
                  <td>
                    <span className={`cuaca-badge ${item.kondisi_cuaca?.toLowerCase()}`}>
                      {item.kondisi_cuaca}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="detail-btn"
                        onClick={() => handleDetailClick(item)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                        </svg>
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data">
                  Tidak ada data laporan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedLaporan && (
        <DetailModal
          isOpen={isDetailOpen}
          laporan={selectedLaporan}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default ArchiveTable;