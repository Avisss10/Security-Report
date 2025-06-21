
import pool from '../config/db.js';

export const getLaporanHariIni = async (id_user, id_cabang) => {
  const [laporanRows] = await pool.query(
    `SELECT
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
    ORDER BY l.waktu_laporan DESC`,
    [id_cabang]
  );

  // Ambil semua foto untuk masing-masing laporan
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
