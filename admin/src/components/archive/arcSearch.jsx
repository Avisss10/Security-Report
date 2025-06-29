import React, { useState, useEffect } from 'react';
import '../../styles/search.css';
import axios from '../../utils/axiosInstance';

const ArchiveSearch = ({ onSearch, filter: propFilter }) => {
  const [filter, setFilter] = useState({
    jenis: '',
    id_cabang: '',
    dari: '',
    sampai: '',
    date_range: ''
  });

  const [cabangList, setCabangList] = useState([]);
  const [jenisList, setJenisList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/cabang')
      .then(res => setCabangList(res.data))
      .catch(err => console.error('Gagal ambil cabang:', err));
  }, []);

  // Dapatkan semua jenis laporan dari data unik
  useEffect(() => {
    axios.get('http://localhost:5000/api/laporan/jenis-laporan')
      .then(res => setJenisList(res.data))
      .catch(err => console.error('Gagal ambil jenis laporan:', err));
  }, []);

  useEffect(() => {
    if (propFilter) {
      setFilter({
        jenis: propFilter.jenis || '',
        id_cabang: propFilter.id_cabang || '',
        dari: propFilter.dari || '',
        sampai: propFilter.sampai || '',
        date_range: ''
      });
    }
  }, [propFilter]);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    let dariDate = null;
    let sampaiDate = now;

    if (filter.date_range === 'today') {
      dariDate = new Date(now.toISOString().split('T')[0]); // tanggal hari ini
    } else if (filter.date_range === '7days') {
      const semingguLalu = new Date();
      semingguLalu.setDate(now.getDate() - 7);
      dariDate = semingguLalu;
    }

    const finalFilter = {
      ...filter,
      dari: dariDate ? dariDate.toISOString().split('T')[0] : '',
      sampai: sampaiDate.toISOString().split('T')[0],
    };

    onSearch(finalFilter);
  };

  const handleReset = () => {
    setFilter({
      jenis: '',
      id_cabang: '',
      dari: '',
      sampai: '',
      date_range: ''
    });
    onSearch({});
  };

  return (
    <div className='post'>
      <form className="search-row" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="jenis">Jenis Laporan:</label>
          <select name="jenis" value={filter.jenis} onChange={handleChange}>
            <option value="">Semua Jenis</option>
            {jenisList.map((jenis, index) => (
              <option key={index} value={jenis}>{jenis}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="id_cabang">Cabang:</label>
          <select name="id_cabang" value={filter.id_cabang} onChange={handleChange}>
            <option value="">Semua Cabang</option>
            {cabangList.map((cabang) => (
              <option key={cabang.id_cabang} value={cabang.id_cabang}>
                {cabang.nama_cabang}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="date_range">Rentang:</label>
          <select
            name="date_range"
            value={filter.date_range}
            onChange={handleChange}
          >
            <option value="">Pilih Rentang</option>
            <option value="today">Hari ini</option>
            <option value="7days">7 Hari Kebelakang</option>
          </select>
        </div>

        {/* Tombol di luar input-group */}
        <div className="button-group">
          <button type="submit" className="btn-search">Cari</button>
          <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
        </div>
      </form>

      <div className="search-tips">
        <p>📊 Pilih rentang "Hari ini" untuk laporan terbaru atau "7 Hari Kebelakang" untuk laporan minggu ini.</p>
      </div>
    </div>
  );
};

export default ArchiveSearch;
