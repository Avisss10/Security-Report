import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentHeader from './contentHeader';
import Post from './post';
import '../../styles/content.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Content = () => {
  const [laporanHariIni, setLaporanHariIni] = useState([]);
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState('');

  useEffect(() => {
    fetchLaporanHariIni();
    fetchCabangOptions();
  }, []);

  const fetchLaporanHariIni = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/laporan/today`);
      setLaporanHariIni(res.data);
      setFilteredLaporan(res.data);
    } catch (err) {
      console.error('Gagal fetch laporan hari ini:', err);
      toast.error('Gagal fetch laporan hari ini');
    }
  };

  const fetchCabangOptions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cabang`);
      // Assuming the API returns an array of cabang objects with a 'nama_cabang' property
      const cabangNames = res.data.map(cabang => cabang.nama_cabang).filter(Boolean);
      setCabangOptions(cabangNames);
    } catch (err) {
      console.error('Gagal fetch cabang options:', err);
      toast.error('Gagal fetch cabang options');
    }
  };

  const handleDeleteLaporan = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/laporan/${id}`);
      setLaporanHariIni(prev => prev.filter(l => l.id_laporan !== id));
      setFilteredLaporan(prev => prev.filter(l => l.id_laporan !== id));
      toast.success('Laporan berhasil dihapus');
    } catch (err) {
      console.error('Gagal hapus laporan:', err);
      toast.error('Gagal hapus laporan');
    }
  };

  const handleCabangChange = (value) => {
    setSelectedCabang(value);
    if (!value) {
      setFilteredLaporan(laporanHariIni);
    } else {
      const filtered = laporanHariIni.filter(l => l.nama_cabang === value);
      setFilteredLaporan(filtered);
    }
  };

  const handleSearch = () => {
    if (!selectedCabang) {
      setFilteredLaporan(laporanHariIni);
    } else {
      const filtered = laporanHariIni.filter(l => l.nama_cabang === selectedCabang);
      setFilteredLaporan(filtered);
    }
  };

  return (
    <div className="content">
      {/* Header with filter */}
      <ContentHeader
        cabangOptions={cabangOptions}
        selectedCabang={selectedCabang}
        onCabangChange={handleCabangChange}
        onSearch={handleSearch}
      />

      {/* Filter description */}
      <div className="filter-description" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
        {selectedCabang ? ` ${selectedCabang}` : ''}
      </div>

      {/* Dashboard content */}
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
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Content;
