import db from '../config/db.js';

const Cabang = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM cabang');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM cabang WHERE id_cabang = ?', [id]);
    return rows;
  },

  create: async (data) => {
    const [result] = await db.query('INSERT INTO cabang SET ?', data);
    return result;
  },

  update: async (id, data) => {
    const [result] = await db.query('UPDATE cabang SET ? WHERE id_cabang = ?', [data, id]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM cabang WHERE id_cabang = ?', [id]);
    return result;
  },
};

export default Cabang;
