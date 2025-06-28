import React, { useState } from 'react';
import '../../styles/arcTable.css';
import DetailModal from './DetailModal';

const ArchiveTable = ({ laporan, onDelete }) => {
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10; // jumlah data per halaman
  const totalPages = Math.ceil(laporan.length / pageSize);
  const paginatedData = laporan.slice((page - 1) * pageSize, page * pageSize);

  // Reset ke halaman 1 jika data berubah
  React.useEffect(() => { setPage(1); }, [laporan]);

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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
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

      {/* Pagination Controls */}
      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          {/* Previous Button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`pagination-btn pagination-nav ${page === 1 ? 'disabled' : ''}`}
          >
            <span>‹</span>
            <span className="nav-text">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="pagination-numbers">
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let start = Math.max(1, page - Math.floor(maxVisible / 2));
              let end = Math.min(totalPages, start + maxVisible - 1);
              
              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
              }

              // First page and ellipsis
              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setPage(1)}
                    className="pagination-btn pagination-number"
                  >
                    1
                  </button>
                );
                if (start > 2) {
                  pages.push(
                    <span key="ellipsis1" className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }
              }

              // Visible pages
              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`pagination-btn pagination-number ${page === i ? 'active' : ''}`}
                  >
                    {i}
                  </button>
                );
              }

              // Last page and ellipsis
              if (end < totalPages) {
                if (end < totalPages - 1) {
                  pages.push(
                    <span key="ellipsis2" className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => setPage(totalPages)}
                    className="pagination-btn pagination-number"
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`pagination-btn pagination-nav ${page === totalPages ? 'disabled' : ''}`}
          >
            <span className="nav-text">Next</span>
            <span>›</span>
          </button>
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <div className="pagination-info">
          Showing page {page} of {totalPages}
        </div>
      )}

      {selectedLaporan && (
        <DetailModal
          isOpen={isDetailOpen}
          laporan={selectedLaporan}
          onClose={handleCloseDetail}
          onDelete={(id) => {
          onDelete(id);
          handleCloseDetail();
          }}
        />
      )}
    </div>
  );
};

export default ArchiveTable;