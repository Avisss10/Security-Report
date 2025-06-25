// models/laporanModel.js
import pool from '../config/db.js';

// ==============================
// 🔍 GET SEMUA LAPORAN (Admin)
// ==============================
export const getAllLaporan = async () => {
  const [rows] = await pool.query(`
    SELECT 
      l.id_laporan,
      l.judul_laporan,
      l.jenis_laporan,
      l.hari_laporan,
      l.tanggal_laporan,
      l.waktu_laporan,
      l.kondisi_cuaca,
      l.deskripsi_laporan,
      l.created_at,
      u.nama_user,
      u.nip,
      c.nama_cabang,
      GROUP_CONCAT(f.foto_path) AS foto_paths
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON l.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    GROUP BY l.id_laporan
    ORDER BY l.id_laporan DESC
  `);
  return rows;
};

// ==============================
// 📋 GET LAPORAN HARI INI (Mobile)
// ==============================
export const getLaporanHariIni = async (id_user, id_cabang) => {
  const [laporanRows] = await pool.query(`
    SELECT
      l.id_laporan,
      l.id_user,
      u.nip,
      u.nama_user,
      c.nama_cabang,
      l.jenis_laporan,
      l.judul_laporan,
      l.kondisi_cuaca,
      l.deskripsi_laporan,
      l.tanggal_laporan,
      TIME_FORMAT(l.waktu_laporan, '%H:%i') AS waktu_laporan
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON l.id_cabang = c.id_cabang
    WHERE l.id_cabang = ? AND l.tanggal_laporan = CURDATE()
    ORDER BY l.waktu_laporan DESC
  `, [id_cabang]);

  for (const laporan of laporanRows) {
    const [fotos] = await pool.query(
      'SELECT id_foto, foto_path FROM foto_laporan WHERE id_laporan = ?',
      [laporan.id_laporan]
    );
    laporan.foto = fotos;
    laporan.canDelete = laporan.id_user === Number(id_user);
  }

  return laporanRows;
};

// ==============================
// 🔍 GET BY ID (Admin & Mobile)
// ==============================
export const getLaporanById = async (id) => {
  const [rows] = await pool.query(`
    SELECT 
      l.*, u.nama_user, u.nip, c.nama_cabang,
      GROUP_CONCAT(f.foto_path) AS foto_paths
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON l.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    WHERE l.id_laporan = ?
    GROUP BY l.id_laporan
  `, [id]);

  return rows.length > 0 ? rows[0] : null;
};

// ==============================
// ➕ INSERT LAPORAN
// ==============================
export const insertLaporan = async (data) => {
  const {
    id_user,
    id_cabang,
    jenis_laporan,
    judul_laporan,
    kondisi_cuaca,
    deskripsi_laporan,
    foto_paths = [],
  } = data;

  const [result] = await pool.query(
    `INSERT INTO laporan 
     (id_user, id_cabang, jenis_laporan, judul_laporan, hari_laporan, tanggal_laporan, waktu_laporan, kondisi_cuaca, deskripsi_laporan)
     VALUES (?, ?, ?, ?, DAYNAME(CURDATE()), CURDATE(), CURTIME(), ?, ?)`,
    [id_user, id_cabang, jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan]
  );

  const id_laporan = result.insertId;

  if (foto_paths.length > 0) {
    const values = foto_paths.map(f => [id_laporan, f]);
    await pool.query(
      'INSERT INTO foto_laporan (id_laporan, foto_path) VALUES ?',
      [values]
    );
  }

  return result;
};

// ==============================
// ❌ DELETE LAPORAN BY ID (Admin)
// ==============================
export const deleteLaporan = async (id) => {
  const [result] = await pool.query('DELETE FROM laporan WHERE id_laporan = ?', [id]);
  return result;
};

// ==============================
// ❌ DELETE LAPORAN IF OWNED (Mobile)
// ==============================
export const deleteLaporanIfOwned = async (id_laporan, id_user) => {
  const [rows] = await pool.query(
    'SELECT * FROM laporan WHERE id_laporan = ? AND id_user = ?',
    [id_laporan, id_user]
  );
  if (rows.length === 0) return false;

  await pool.query('DELETE FROM foto_laporan WHERE id_laporan = ?', [id_laporan]);
  await pool.query('DELETE FROM laporan WHERE id_laporan = ?', [id_laporan]);
  return true;
};

// ==============================
// 📊 FILTER LAPORAN
// ==============================
export const filterLaporan = async (params) => {
  let query = `
    SELECT 
      l.*, u.nama_user, u.nip, c.nama_cabang,
      GROUP_CONCAT(f.foto_path) AS foto_paths
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON l.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    WHERE 1=1
  `;

  const values = [];

  if (params.tanggal) {
    query += ' AND l.tanggal_laporan = ?';
    values.push(params.tanggal);
  }

  if (params.jenis) {
    query += ' AND l.jenis_laporan = ?';
    values.push(params.jenis);
  }

  if (params.id_cabang) {
    query += ' AND l.id_cabang = ?';
    values.push(params.id_cabang);
  }

  query += ' GROUP BY l.id_laporan ORDER BY l.tanggal_laporan DESC';

  const [rows] = await pool.query(query, values);
  return rows;
};
