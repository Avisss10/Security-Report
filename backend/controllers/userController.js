import db from '../config/db.js';

// GET semua user (bisa filter ?level=Security)
export const getAllUsers = async (req, res) => {
  const levelFilter = req.query.level;

  let query = `
    SELECT u.id_user, u.nip, u.nama_user, u.password, u.id_level, l.nama_level,
           u.id_cabang, c.nama_cabang
    FROM user u
    JOIN level_user l ON u.id_level = l.id_level
    LEFT JOIN cabang c ON u.id_cabang = c.id_cabang
  `;

  const params = [];

  if (levelFilter) {
    query += ' WHERE l.nama_level = ?';
    params.push(levelFilter);
  }

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: tambah user
export const createUser = async (req, res) => {
  const { nip, nama_user, password, id_level, id_cabang } = req.body;

  const query = `
    INSERT INTO user (nip, nama_user, password, id_level, id_cabang)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(query, [nip, nama_user, password, id_level, id_cabang]);
    res.status(201).json({ message: 'User berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nip, nama_user, password, id_level, id_cabang } = req.body;

  const query = `
    UPDATE user
    SET nip = ?, nama_user = ?, password = ?, id_level = ?, id_cabang = ?
    WHERE id_user = ?
  `;

  try {
    await db.query(query, [nip, nama_user, password, id_level, id_cabang, id]);
    res.json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: hapus user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM user WHERE id_user = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('Error saat delete user:', err); // log error
    res.status(500).json({ error: err.message });
  }
};
