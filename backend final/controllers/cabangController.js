import Cabang from '../models/cabangModel.js';

export const getAllCabang = async (req, res) => {
  try {
    const results = await Cabang.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCabangById = async (req, res) => {
  try {
    const results = await Cabang.getById(req.params.id);
    if (results.length === 0) return res.status(404).json({ message: 'Cabang tidak ditemukan' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCabang = async (req, res) => {
  try {
    const result = await Cabang.create(req.body);
    res.status(201).json({ message: 'Cabang berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCabang = async (req, res) => {
  try {
    await Cabang.update(req.params.id, req.body);
    res.json({ message: 'Cabang berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCabang = async (req, res) => {
  try {
    await Cabang.delete(req.params.id);
    res.json({ message: 'Cabang berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

