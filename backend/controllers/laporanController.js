import pool from '../config/db.js';
import fs from 'fs/promises';

// ==============================
// 📅 GET LAPORAN HARI INI (Today)
// ==============================
export const getTodayLaporan = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        l.id_laporan, l.jenis_laporan, l.judul_laporan, l.kondisi_cuaca, 
        l.deskripsi_laporan, l.tanggal_laporan, l.waktu_laporan, l.hari_laporan,
        u.nama_user, u.nip,
        c.nama_cabang,
        GROUP_CONCAT(f.foto_path) AS foto_list
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON l.id_cabang = c.id_cabang
      LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
      WHERE l.tanggal_laporan = CURDATE()
      GROUP BY l.id_laporan
      ORDER BY l.id_laporan DESC
    `);

    const formatted = results.map(item => ({
      ...item,
      foto_list: item.foto_list ? item.foto_list.split(',') : []
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil laporan hari ini', error: err.message });
  }
};

// ==============================
// 📥 CREATE LAPORAN
// ==============================
export const createLaporan = async (req, res) => {
  try {
    const {
      id_user, id_cabang, jenis_laporan,
      judul_laporan, kondisi_cuaca, deskripsi_laporan
    } = req.body;

    const files = req.files || [];

    // Insert laporan
    const [result] = await pool.query(
      `INSERT INTO laporan (id_user, id_cabang, jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan, tanggal_laporan, waktu_laporan, hari_laporan) 
       VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURTIME(), DAYNAME(CURDATE()))`,
      [id_user, id_cabang, jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan]
    );

    const id_laporan = result.insertId;

    // Insert foto jika ada
    if (files.length > 0) {
      const values = files.map(file => [id_laporan, file.filename]);
      await pool.query('INSERT INTO foto_laporan (id_laporan, foto_path) VALUES ?', [values]);
    }

    res.json({ message: 'Laporan berhasil disimpan', id_laporan: result.insertId });
  } catch (err) {
    console.error('CREATE LAPORAN ERROR:', err);
    res.status(500).json({ message: 'Gagal simpan laporan', error: err.message });
  }
};

// ==============================
// 📄 GET SEMUA LAPORAN (Admin)
// ==============================
export const getAllLaporan = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT l.*, u.nama_user, u.nip, c.nama_cabang,
             GROUP_CONCAT(f.foto_path) AS foto_paths
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON u.id_cabang = c.id_cabang
      LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
      GROUP BY l.id_laporan
      ORDER BY l.tanggal_laporan DESC
    `);

    results.forEach(row => {
      row.foto_paths = row.foto_paths ? row.foto_paths.split(',') : [];
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil laporan', error: err.message });
  }
};

// ==============================
// 📆 GET DASHBOARD LAPORAN (Mobile)
// ==============================
export const getDashboardLaporan = async (req, res) => {
  const { id_user, id_cabang } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT l.*, c.nama_cabang, u.nama_user, u.nip
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON u.id_cabang = c.id_cabang
      WHERE DATE(l.tanggal_laporan) = CURDATE()
        AND u.id_user = ? AND u.id_cabang = ?
      ORDER BY l.waktu_laporan DESC
    `, [id_user, id_cabang]);

    // Fetch photos separately for each laporan
    const laporanWithFotos = await Promise.all(rows.map(async (row) => {
      const [fotos] = await pool.query('SELECT id_foto, foto_path FROM foto_laporan WHERE id_laporan = ?', [row.id_laporan]);
      return {
        ...row,
        foto: fotos,
        canDelete: row.id_user === Number(id_user)
      };
    }));

    res.json(laporanWithFotos);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil laporan', error: err.message });
  }
};

// ==============================
// 📁 GET DETAIL LAPORAN
// ==============================
export const getLaporanById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT l.*, u.nama_user, u.nip, c.nama_cabang,
              TIME_FORMAT(l.waktu_laporan, '%H:%i') AS waktu_laporan
       FROM laporan l
       JOIN user u ON l.id_user = u.id_user
       JOIN cabang c ON l.id_cabang = c.id_cabang
       WHERE l.id_laporan = ?`, [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    const [fotos] = await pool.query(
      'SELECT foto_path FROM foto_laporan WHERE id_laporan = ?', [id]
    );

    const laporan = rows[0];
    laporan.foto = fotos.map(f => f.foto_path);
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil detail laporan', error: err.message });
  }
};

// ==============================
// ❌ DELETE LAPORAN (ADMIN, tanpa cek user)
// ==============================
export const deleteLaporanAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM laporan WHERE id_laporan = ?', [id]);
    res.json({ message: 'Laporan berhasil dihapus (admin)' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus laporan', error: err.message });
  }
};

// ==============================
// ❌ DELETE LAPORAN (SECURITY)
// ==============================
export const deleteLaporan = async (req, res) => {
  const { id_laporan, id_user } = req.params;
  try {
    // Cek kepemilikan laporan
    const [rows] = await pool.query('SELECT id_user FROM laporan WHERE id_laporan = ?', [id_laporan]);
    if (rows.length === 0) return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    if (rows[0].id_user !== Number(id_user)) {
      return res.status(403).json({ message: 'Tidak diizinkan menghapus laporan ini' });
    }

    await pool.query('DELETE FROM laporan WHERE id_laporan = ?', [id_laporan]);
    res.json({ message: 'Laporan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus laporan', error: err.message });
  }
};

// ==============================
// ✏️ UPDATE LAPORAN
// ==============================
export const updateLaporan = async (req, res) => {
  const { id } = req.params;
  const { jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan, id_user } = req.body;

  try {
    const [cek] = await pool.query(
      'SELECT id_user FROM laporan WHERE id_laporan = ?', [id]
    );

    if (cek.length === 0) return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    if (cek[0].id_user !== Number(id_user)) {
      return res.status(403).json({ message: 'Tidak diizinkan mengedit laporan ini' });
    }

    await pool.query(
      `UPDATE laporan SET jenis_laporan = ?, judul_laporan = ?, kondisi_cuaca = ?, deskripsi_laporan = ?
       WHERE id_laporan = ?`,
      [jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan, id]
    );

    res.json({ message: 'Laporan berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update laporan', error: err.message });
  }
};

// ==============================
// 🧯 DELETE FOTO
// ==============================
export const deleteFoto = async (req, res) => {
  const { id } = req.params;
  try {

    // Pastikan id berupa angka
    if (isNaN(Number(id))) {
      return res.status(400).json({ message: 'ID foto tidak valid' });
    }

    // Cari foto berdasarkan id_foto
    const [rows] = await pool.query('SELECT foto_path FROM foto_laporan WHERE id_foto = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Foto tidak ditemukan' });
    }
    const filename = rows[0].foto_path;
    
    // Hapus data di database
    await pool.query('DELETE FROM foto_laporan WHERE id_foto = ?', [id]);

    // Hapus file fisik jika ada
    try {
      const fs = await import('fs/promises');
      await fs.unlink(`./uploads/${filename}`);
    } catch (fileErr) {
      console.warn('File not found or failed to delete:', filename);
    }
    res.json({ message: 'Foto berhasil dihapus' });
  } catch (err) {
    console.error('DELETE FOTO ERROR:', err);
    res.status(500).json({ message: 'Gagal hapus foto', error: err.message });
  }
};

// ==============================
// ➕ TAMBAH FOTO KE LAPORAN
// ==============================
export const tambahFotoLaporan = async (req, res) => {
  // Ambil id_laporan dari param jika ada, atau dari body jika tidak ada param
  const id_laporan = req.params.id || req.body.id_laporan;
  try {
    let values = [];
    // Jika upload multiple (req.files), gunakan map
    if (req.files && req.files.length > 0) {
      values = req.files.map(file => [id_laporan, file.filename]);
    }
    // Jika upload single (req.file), push satu data
    else if (req.file) {
      values = [[id_laporan, req.file.filename]];
    } else {
      return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    await pool.query(
      'INSERT INTO foto_laporan (id_laporan, foto_path) VALUES ?', [values]
    );

    res.json({ message: 'Foto berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal tambah foto', error: err.message });
  }
};

// ==============================
// 📊 GET ENUM JENIS LAPORAN
// ==============================
export const getJenisLaporan = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'laporan' 
        AND COLUMN_NAME = 'jenis_laporan' 
        AND TABLE_SCHEMA = 'security_db'
    `);

    if (rows.length === 0) return res.status(404).json({ message: 'Kolom tidak ditemukan' });

    const enumString = rows[0].COLUMN_TYPE;
    const enumValues = enumString
      .replace(/^enum\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .map(val => val.replace(/'/g, ''));

    res.json(enumValues);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil jenis laporan', error: err.message });
  }
};

// ==============================
// 📁 GET ARSIP LAPORAN
// ==============================
export const getRecentArsip = async (req, res) => {
  const { jenis, id_cabang, dari, sampai } = req.query;

  try {
    let sql = `
      SELECT l.*, u.nama_user, u.nip, c.nama_cabang,
             GROUP_CONCAT(f.foto_path) AS foto_list
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON u.id_cabang = c.id_cabang
      LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
      WHERE 1=1
    `;

    const params = [];

    if (dari) {
      sql += ' AND l.tanggal_laporan >= ?';
      params.push(dari);
    } else {
      sql += ' AND l.tanggal_laporan >= CURDATE() - INTERVAL 7 DAY';
    }

    if (sampai) {
      sql += ' AND l.tanggal_laporan <= ?';
      params.push(sampai);
    }

    if (jenis) {
      sql += ' AND l.jenis_laporan = ?';
      params.push(jenis);
    }

    if (id_cabang) {
      sql += ' AND u.id_cabang = ?';
      params.push(id_cabang);
    }

    sql += ' GROUP BY l.id_laporan ORDER BY l.tanggal_laporan DESC';

    const [result] = await pool.query(sql, params);

    const formatted = result.map(r => ({
      ...r,
      foto_list: r.foto_list ? r.foto_list.split(',') : []
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil arsip laporan', error: err.message });
  }
};
