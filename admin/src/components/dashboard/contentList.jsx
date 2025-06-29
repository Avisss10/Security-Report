import React from 'react';
import Post from './post';

const ContentList = ({ filteredLaporan, selectedCabang, handleDeleteLaporan }) => (
  <>
    <div className="filter-description" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
      {selectedCabang ? ` ${selectedCabang}` : ''}
    </div>
    {filteredLaporan.length === 0 ? (
      <p>
        {selectedCabang
          ? `Belum ada laporan dari cabang ${selectedCabang}`
          : 'Belum ada laporan hari ini.'}
      </p>
    ) : (
      filteredLaporan.map((laporan) => (
        <Post
          key={laporan.id_laporan}
          nama_user={laporan.nama_user}
          nip={laporan.nip}
          nama_cabang={laporan.nama_cabang}
          deskripsi={laporan.deskripsi_laporan}
          jenis={laporan.jenis_laporan}
          judul={laporan.judul_laporan}
          cuaca={laporan.kondisi_cuaca}
          hari={laporan.hari_laporan}
          waktu={laporan.waktu_laporan}
          tanggal={laporan.tanggal_laporan}
          foto_list={laporan.foto_list}
          onDelete={() => handleDeleteLaporan(laporan.id_laporan)}
        />
      ))
    )}
  </>
);

export default ContentList;