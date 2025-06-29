import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import ArchiveTable from './ArcTable';
import ArcSearch from './arcSearch';
import ArcHeader from './arcHeader';

const Archive = () => {
  const [laporan, setLaporan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState({ dari: null, sampai: null, jenis: null, id_cabang: null });
  const [cabangList, setCabangList] = useState([]);

  // Ambil daftar cabang saat mount
  useEffect(() => {
    const fetchCabang = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cabang');
        setCabangList(res.data);
      } catch (err) {
        console.error('Gagal ambil data cabang:', err);
      }
    };
    fetchCabang();
  }, []);

  const fetchData = async (filterParams = null) => {
    try {
      setLoading(true);
      let params = {};
      if (filterParams) {
        params = { ...filterParams };
        const today = new Date().toISOString().split('T')[0];
        if (!params.dari) {
          params.dari = today;
        }
        if (!params.sampai) {
          params.sampai = today;
        }
      } else {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        params = { dari: today, sampai: today };
      }
      const res = await axios.get('http://localhost:5000/api/laporan/arsip', { params });
      setLaporan(res.data);
      setFiltered(res.data);
      setCurrentFilter(params);
    } catch (err) {
      console.error('Gagal ambil data arsip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSearch = (filter) => {
    const defaultFilter = { dari: new Date().toISOString().split('T')[0], sampai: new Date().toISOString().split('T')[0], jenis: '', id_cabang: '' };
    const appliedFilter = filter || defaultFilter;
    fetchData(appliedFilter);
    setCurrentFilter(appliedFilter);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/laporan/${id}`);
      const updated = laporan.filter(item => item.id_laporan !== id);
      setLaporan(updated);
      setFiltered(updated);
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk dapatkan nama cabang dari id
  const getCabangName = (id) => {
    if (!id) return '';
    const found = cabangList.find(c => String(c.id_cabang) === String(id));
    return found ? found.nama_cabang : id;
  };

  const renderFilterDescription = () => {
    const { dari, sampai, jenis, id_cabang } = currentFilter;
    let descriptions = [];

    if (dari && sampai) {
      if (dari === sampai) {
        descriptions.push({ label: 'Laporan', value: 'Hari Ini (' + dari + ')' });
      } else {
        descriptions.push({ label: 'Laporan', value: 'Dari ' + dari + ' sampai ' + sampai });
      }
    }

    if (jenis) {
      descriptions.push({ label: 'Jenis', value: jenis });
    }

    if (id_cabang) {
      descriptions.push({ label: 'Cabang', value: getCabangName(id_cabang) });
    }

    if (descriptions.length === 0) {
      // Default to "Laporan Hari Ini" if no filters active
      const today = new Date().toISOString().split('T')[0];
      descriptions.push({ label: 'Laporan', value: 'Hari Ini (' + today + ')' });
    }

    return (
      <div className="filter-description-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {descriptions.map((desc, index) => (
          <div
            key={index}
            className="filter-badge"
            style={{
              backgroundColor: '#6f42c1',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '15px',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            title={desc.label + ': ' + desc.value}
          >
            <strong>{desc.label}:</strong> {desc.value}
          </div>
        ))}
      </div>
    );
  };

return (
    <div className="archive-wrapper">
      <ArcHeader/>
      <ArcSearch
        filter={currentFilter}
        onSearch={handleFilterSearch}
      />
      <div className="filter-description">
        {renderFilterDescription()}
      </div>
      {loading ? (
        <div className="table-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <ArchiveTable laporan={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Archive;