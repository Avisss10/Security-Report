import pool from '../config/db.js';

export const findUserByNip = async (nip) => {
  const [rows] = await pool.query(
    `SELECT u.*, c.nama_cabang FROM user u
     LEFT JOIN cabang c ON u.id_cabang = c.id_cabang
     WHERE u.nip = ?`,
    [nip]
  );
  return rows[0];
};
