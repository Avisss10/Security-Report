import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from '../../utils/axiosInstance';
import ContentHeader from './contentHeader';
import Post from './post';
import '../../styles/content.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ContentList = lazy(() => import('./ContentList'));

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
      const res = await axios.get(`http://localhost:5000/api/laporan/today`);
      setLaporanHariIni(res.data);
      setFilteredLaporan(res.data);
    } catch (err) {
      console.error('Gagal fetch laporan hari ini:', err);
      toast.error('Gagal fetch laporan hari ini');
    }
  };

  const fetchCabangOptions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cabang`);
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
      await axios.delete(`http://localhost:5000/api/laporan/${id}`);
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
      {/* Header selalu tampil */}
      <ContentHeader
        cabangOptions={cabangOptions}
        selectedCabang={selectedCabang}
        onCabangChange={handleCabangChange}
        onSearch={handleSearch}
      />

      {/* Lazy loading */}
      <Suspense
        fallback={
          <div className="table-loading">
            <div className="loading-spinner"></div>
          </div>
        }
      >
        <ContentList
          filteredLaporan={filteredLaporan}
          selectedCabang={selectedCabang}
          handleDeleteLaporan={handleDeleteLaporan}
        />
      </Suspense>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Content;
