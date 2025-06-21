import { findSecurityByNip } from '../models/userModel.js';

export const login = async (req, res) => {
  const { nip, password } = req.body;

  try {
    const user = await findSecurityByNip(nip);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'NIP atau password salah' });
    }

    res.json({
      id_user: user.id_user,
      nama_user: user.nama_user,
      id_cabang: user.id_cabang,
      nama_cabang: user.nama_cabang,
      level_user: user.id_level,
      nip: user.nip,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login gagal', error: err.message });
  }
};
