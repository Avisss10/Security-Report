
import pool from '../config/db.js';
import { getLaporanHariIni, insertLaporan, deleteLaporanIfOwned } from '../models/laporanModel.js';

export const getDashboardLaporan = async (req, res) => {
  const { id_user, id_cabang } = req.params;
  try {
    const laporan = await getLaporanHariIni(id_user, id_cabang);
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil laporan', error: err.message });
  }
};

export const createLaporan = async (req, res) => {
  try {
    const {
      id_user, id_cabang, jenis_laporan,
      judul_laporan, kondisi_cuaca, deskripsi_laporan
    } = req.body;

    const files = req.files || [];

    await insertLaporan({
      id_user,
      id_cabang,
      jenis_laporan,
      judul_laporan,
      kondisi_cuaca,
      deskripsi_laporan,
      foto_paths: files.map(file => file.filename),
    });

    res.json({ message: 'Laporan berhasil disimpan' });
  } catch (err) {
    console.error('CREATE LAPORAN ERROR:', err);
    res.status(500).json({
      message: 'Gagal simpan laporan',
      error: err.message,
    });
  }
};
export const getLaporanById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT l.*, u.nama_user, u.nip, c.nama_cabang,
              TIME_FORMAT(l.waktu_laporan, '%H:%i') AS waktu_laporan
       FROM laporan l
       JOIN user u ON l.id_user = u.id_user
       JOIN cabang c ON l.id_cabang = c.id_cabang
       WHERE l.id_laporan = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    const [fotos] = await pool.query(
      'SELECT foto_path FROM foto_laporan WHERE id_laporan = ?',
      [id]
    );

    const laporan = rows[0];
    laporan.foto = fotos.map(f => f.foto_path);

    res.json(laporan);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil detail laporan', error: err.message });
  }
};


export const deleteLaporan = async (req, res) => {
  const { id_laporan, id_user } = req.params;
  try {
    const deleted = await deleteLaporanIfOwned(id_laporan, id_user);
    if (!deleted) {
      return res.status(403).json({ message: 'Tidak bisa menghapus laporan orang lain' });
    }
    res.json({ message: 'Laporan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus laporan', error: err.message });
  }
};

export const updateLaporan = async (req, res) => {
  const { id } = req.params;
  const { jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan, id_user } = req.body;

  try {
    // ✅ Validasi apakah laporan milik user
    const [cek] = await pool.query(
      'SELECT id_user FROM laporan WHERE id_laporan = ?',
      [id]
    );

    if (cek.length === 0) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    if (cek[0].id_user !== Number(id_user)) {
      return res.status(403).json({ message: 'Tidak diizinkan mengedit laporan ini' });
    }

    // ✅ Update jika pemilik
    await pool.query(
      `UPDATE laporan
       SET jenis_laporan = ?, judul_laporan = ?, kondisi_cuaca = ?, deskripsi_laporan = ?
       WHERE id_laporan = ?`,
      [jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan, id]
    );

    res.json({ message: 'Laporan berhasil diupdate' });
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ message: 'Gagal update laporan', error: err.message });
  }
};


export const deleteFoto = async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil path dari database
    const [rows] = await pool.query('SELECT foto_path FROM foto_laporan WHERE id_foto = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Foto tidak ditemukan' });

    const filename = rows[0].foto_path;

    // Hapus dari database
    await pool.query('DELETE FROM foto_laporan WHERE id_foto = ?', [id]);

    // Hapus dari filesystem
    const fs = await import('fs');
    fs.unlink(`./uploads/${filename}`, (err) => {
      if (err) console.error('Gagal hapus file:', err); // log jika error
    });

    res.json({ message: 'Foto berhasil dihapus' });
  } catch (err) {
    console.error('DELETE FOTO ERROR:', err);
    res.status(500).json({ message: 'Gagal hapus foto', error: err.message });
  }
};


export const tambahFotoLaporan = async (req, res) => {
  const { id_laporan } = req.body;
  try {
    if (!id_laporan) return res.status(400).json({ message: 'ID laporan wajib diisi' });

    const values = req.files.map((file) => [id_laporan, file.filename]);

    await pool.query(
      'INSERT INTO foto_laporan (id_laporan, foto_path) VALUES ?',
      [values]
    );

    res.json({ message: 'Foto baru berhasil ditambahkan' });
  } catch (err) {
    console.error('Gagal tambah foto:', err);
    res.status(500).json({ message: 'Gagal tambah foto', error: err.message });
  }
};
