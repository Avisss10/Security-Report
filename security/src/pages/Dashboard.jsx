import React from 'react';
import { useEffect, useState, useRef } from 'react';
import axios from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import ReportCard from '../components/ReportCard';
import FloatingCreateButton from '../components/FloatingCreateButton';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toastStyles.css';

const Dashboard = () => {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const id_user = localStorage.getItem('id_user');
  const id_cabang = localStorage.getItem('id_cabang');
  const mainRef = useRef(null);
  const location = useLocation();

  const fetchLaporan = async () => {
    setLoading(true);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/laporan/dashboard/${id_user}/${id_cabang}`);
      setLaporan(res.data);
    } catch (err) {
      console.error('Gagal fetch laporan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_laporan) => {
    try {
      const id_user = localStorage.getItem('id_user');
      await axios.delete(`http://localhost:5000/api/laporan/${id_laporan}/${id_user}`);
      fetchLaporan();
      toast.success('Laporan berhasil dihapus', {
        style: { backgroundColor: '#7c3aed', color: 'white' },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal hapus laporan', {
        style: { backgroundColor: '#dc2626', color: 'white' },
      });
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchLaporan();
    }
  }, [location.state]);

  return (
    <>
      <Header />
      <main ref={mainRef} className="pt-28 px-4 overflow-auto max-h-screen">
        {loading ? (
          <LoadingSpinner />
        ) : laporan.length === 0 ? (
          <p className="text-sm text-gray-500 mt-4">Belum ada laporan hari ini.</p>
        ) : (
          laporan.map((lapor) => (
            <ReportCard
              key={lapor.id_laporan}
              id_laporan={lapor.id_laporan}
              name={lapor.nama_user}
              nip={lapor.nip}
              location={lapor.nama_cabang}
              message={lapor.deskripsi_laporan}
              time={lapor.waktu_laporan}
              date={lapor.tanggal_laporan}
              foto={lapor.foto}
              jenis={lapor.jenis_laporan}
              judul={lapor.judul_laporan}
              cuaca={lapor.kondisi_cuaca}
              canDelete={lapor.canDelete}
              onDelete={() => handleDelete(lapor.id_laporan)}
              onUpdate={fetchLaporan}
            />
          ))
        )}
        <FloatingCreateButton />
      </main>
      <ToastContainer position="top-center" />
    </>
  );
};

export default Dashboard;
