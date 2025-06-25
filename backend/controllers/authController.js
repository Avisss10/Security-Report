import { findUserByNip } from '../models/userModel.js';

export const login = async (req, res) => {
  const { nip, password } = req.body;

  try {
    const user = await findUserByNip(nip);

    if (!user) {
      return res.status(404).json({ message: 'NIP tidak ditemukan' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Password salah' });
    }

    res.json({
      message: 'Login berhasil',
      user: {
        id_user: user.id_user,
        nama_user: user.nama_user,
        nip: user.nip,
        id_cabang: user.id_cabang,
        nama_cabang: user.nama_cabang,
        id_level: user.id_level,
      }
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Gagal login', error: err.message });
  }
};
