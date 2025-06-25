import React from 'react';
import ArcPost from './arcPost';
import '../../styles/archive.css';

const ArchiveList = ({ laporan, onDelete }) => {
  if (!laporan || laporan.length === 0) {
    return <p className="no-post-message">🔍 Tidak ada laporan ditemukan.</p>;
  }

  return (
    <div className="posts-containerarc">
      {laporan.map((lapor) => (
        <ArcPost
          key={lapor.id_laporan}
          id_laporan={lapor.id_laporan}
          nama_user={lapor.nama_user}
          nip={lapor.nip}
          nama_cabang={lapor.nama_cabang}
          deskripsi={lapor.deskripsi_laporan}
          jenis={lapor.jenis_laporan}
          judul={lapor.judul_laporan}
          cuaca={lapor.kondisi_cuaca}
          hari={lapor.hari_laporan}
          tanggal={lapor.tanggal_laporan}
          waktu={lapor.waktu_laporan}
          foto_list={lapor.foto_list}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ArchiveList;
